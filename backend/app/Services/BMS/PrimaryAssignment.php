<?php
namespace App\Services\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\CentralDepartment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

/**
 * The only writer of an employee's primary organizational assignment
 * (`users.primary_business_unit_id` / `users.primary_central_department_id`).
 *
 * Invariants kept here, because the database cannot express them portably:
 *  1. at most one of the two columns is set;
 *  2. the target is a unit or central department the employee is a MEMBER of
 *     (`business_unit_user` / `bms_central_department_user`);
 *  3. when a membership is removed, a primary assignment that pointed at it is
 *     cleared — it is never moved to another membership, because choosing one
 *     would be a guess.
 *
 * The foreign keys (ON DELETE SET NULL) are only a safety net for hard deletes.
 *
 * Concurrency (MySQL/InnoDB; SQLite has no row locks and serialises writers):
 *  - assign() and clearOrphans() run in a transaction, lock the employee's
 *    `users` row FOR UPDATE first and then read the membership row with a
 *    shared lock. Lock order is always users row -> membership row, and
 *    clearOrphans() takes employees in ascending id order.
 *  - An assignment therefore cannot be committed against a membership whose
 *    removal is already committed, and a removal that commits after the
 *    assignment is followed by the remover's clearOrphans() call, which waits
 *    for the assignment and then clears it.
 *  - This holds only for removal paths that call clearOrphans() after removing
 *    the membership. Today these are EmployeeController::update (same
 *    transaction as the removal) and BusinessUnitController::update (the
 *    removal is committed first, clearOrphans() runs right after it, outside a
 *    shared transaction: if the request dies between the two statements the
 *    orphan stays until the next clearOrphans() call). Any future path that
 *    removes a unit or central-department membership must call clearOrphans().
 *  - EmployeeController::update may touch the membership row before the
 *    `users` row, the reverse of the order used here. InnoDB resolves such a
 *    collision as a deadlock: one transaction is rolled back, nothing
 *    inconsistent is stored. assign()/clearOrphans() retry up to three times
 *    when they are the outermost transaction; otherwise the caller receives
 *    the database error.
 *  - Direct writes to the two columns that bypass this class are not guarded
 *    by the database.
 */
class PrimaryAssignment
{
    public const TYPE_UNIT = 'business_unit';
    public const TYPE_DEPARTMENT = 'central_department';

    private const COLUMN_UNIT = 'primary_business_unit_id';
    private const COLUMN_DEPARTMENT = 'primary_central_department_id';
    private const ATTEMPTS = 3;

    private BmsAudit $audit;

    /** Set once the columns have been seen; a negative answer is never kept. */
    private bool $schemaConfirmed = false;

    public function __construct(BmsAudit $audit)
    {
        $this->audit = $audit;
    }

    /**
     * False on an installation where the Stage B1 migration has not run yet.
     *
     * Only a positive answer is remembered (for the life of this instance): a
     * process that asked before the migration ran sees the columns as soon as
     * they exist, without being restarted.
     */
    public function available(): bool
    {
        if ($this->schemaConfirmed) return true;

        $present = Schema::hasColumn('users', self::COLUMN_UNIT) && Schema::hasColumn('users', self::COLUMN_DEPARTMENT);
        if ($present) $this->schemaConfirmed = true;

        return $present;
    }

    /** @return array{type: ?string, id: ?int} */
    public function current(User $user): array
    {
        return $this->describe($user->primary_business_unit_id, $user->primary_central_department_id);
    }

    /**
     * Set, change or clear (type null) the primary assignment.
     *
     * Only the two primary-assignment columns (and `updated_at`) are written:
     * other unsaved changes on the supplied model are neither persisted nor lost.
     *
     * @throws ValidationException when the type is unknown, the target does not
     *                             exist, or the employee is not a member of it.
     */
    public function assign(User $user, ?string $type, ?int $id = null): User
    {
        abort_unless($this->available(), 409, 'Primary assignments are not available until the database migration has run.');
        if ($type !== null && !in_array($type, [self::TYPE_UNIT, self::TYPE_DEPARTMENT], true)) {
            throw ValidationException::withMessages(['type' => ['The primary assignment must be a business unit or a central department.']]);
        }
        if ($type !== null && !$id) {
            throw ValidationException::withMessages(['id' => ['Choose the unit or department for the primary assignment.']]);
        }

        return DB::transaction(function () use ($user, $type, $id) {
            // Lock order: the employee's row first, the membership row second.
            $stored = DB::table('users')->where('id', $user->getKey())->lockForUpdate()
                ->first(['id', self::COLUMN_UNIT, self::COLUMN_DEPARTMENT]);
            abort_unless($stored, 404, 'This employee does not exist.');

            if ($type === null) {
                return $this->write($user, $stored, null, null, 'employee.primary_assignment_cleared');
            }

            if ($type === self::TYPE_UNIT) {
                // BusinessUnit uses soft deletes: a deleted unit is not found here.
                if (!BusinessUnit::whereKey($id)->exists()) {
                    throw ValidationException::withMessages(['id' => ['This business unit does not exist.']]);
                }
                if (!$this->isUnitMember((int) $stored->id, $id, true)) {
                    throw ValidationException::withMessages(['id' => ['The employee is not a member of this business unit.']]);
                }

                return $this->write($user, $stored, $id, null, 'employee.primary_assignment_set');
            }

            if (!CentralDepartment::whereKey($id)->exists()) {
                throw ValidationException::withMessages(['id' => ['This central department does not exist.']]);
            }
            if (!$this->isDepartmentMember((int) $stored->id, $id, true)) {
                throw ValidationException::withMessages(['id' => ['The employee is not a member of this central department.']]);
            }

            return $this->write($user, $stored, null, $id, 'employee.primary_assignment_set');
        }, self::ATTEMPTS);
    }

    /**
     * Clear every primary assignment that no longer has a matching membership.
     * Call after any change that can remove a membership. Optional filters keep
     * the work to the affected employee(s).
     *
     * @param  int[]|null  $userIds  limit to these employees; null = everyone
     * @return int[] ids of the employees whose primary assignment was cleared
     */
    public function clearOrphans(?array $userIds = null): array
    {
        if (!$this->available()) return [];
        if ($userIds !== null && $userIds === []) return [];

        return DB::transaction(function () use ($userIds) {
            // Candidates are found without locks; each one is then re-checked
            // under a row lock, in ascending id order, before anything is written.
            $candidates = DB::table('users')
                ->when($userIds !== null, fn ($q) => $q->whereIn('users.id', $userIds))
                ->where(function ($q) {
                    $q->where(function ($q) {
                        $q->whereNotNull('users.'.self::COLUMN_UNIT)->whereNotExists(function ($q) {
                            $q->select(DB::raw(1))->from('business_unit_user')
                                ->whereColumn('business_unit_user.user_id', 'users.id')
                                ->whereColumn('business_unit_user.business_unit_id', 'users.'.self::COLUMN_UNIT);
                        });
                    })->orWhere(function ($q) {
                        $q->whereNotNull('users.'.self::COLUMN_DEPARTMENT)->whereNotExists(function ($q) {
                            $q->select(DB::raw(1))->from('bms_central_department_user')
                                ->whereColumn('bms_central_department_user.user_id', 'users.id')
                                ->whereColumn('bms_central_department_user.central_department_id', 'users.'.self::COLUMN_DEPARTMENT);
                        });
                    });
                })
                ->orderBy('users.id')->pluck('users.id')->all();

            $cleared = [];
            foreach ($candidates as $userId) {
                $stored = DB::table('users')->where('id', $userId)->lockForUpdate()
                    ->first(['id', self::COLUMN_UNIT, self::COLUMN_DEPARTMENT]);
                if (!$stored) continue;

                $unitId = $stored->{self::COLUMN_UNIT};
                $departmentId = $stored->{self::COLUMN_DEPARTMENT};
                if ($unitId && !$this->isUnitMember((int) $stored->id, (int) $unitId, true)) {
                    DB::table('users')->where('id', $stored->id)->update([self::COLUMN_UNIT => null]);
                    $this->recordCleared((int) $stored->id, ['type' => self::TYPE_UNIT, 'id' => (int) $unitId]);
                    $cleared[] = (int) $stored->id;
                }
                if ($departmentId && !$this->isDepartmentMember((int) $stored->id, (int) $departmentId, true)) {
                    DB::table('users')->where('id', $stored->id)->update([self::COLUMN_DEPARTMENT => null]);
                    $this->recordCleared((int) $stored->id, ['type' => self::TYPE_DEPARTMENT, 'id' => (int) $departmentId]);
                    $cleared[] = (int) $stored->id;
                }
            }

            return array_values(array_unique($cleared));
        }, self::ATTEMPTS);
    }

    private function isUnitMember(int $userId, int $unitId, bool $lock = false): bool
    {
        return DB::table('business_unit_user')->where('user_id', $userId)->where('business_unit_id', $unitId)
            ->when($lock, fn ($q) => $q->sharedLock())->exists();
    }

    private function isDepartmentMember(int $userId, int $departmentId, bool $lock = false): bool
    {
        return DB::table('bms_central_department_user')->where('user_id', $userId)->where('central_department_id', $departmentId)
            ->when($lock, fn ($q) => $q->sharedLock())->exists();
    }

    /** @return array{type: ?string, id: ?int} */
    private function describe($unitId, $departmentId): array
    {
        if ($unitId) return ['type' => self::TYPE_UNIT, 'id' => (int) $unitId];
        if ($departmentId) return ['type' => self::TYPE_DEPARTMENT, 'id' => (int) $departmentId];

        return ['type' => null, 'id' => null];
    }

    /**
     * Writes both columns in one statement, so the "never both" rule cannot be
     * broken by a partial update, and writes nothing else: the supplied model is
     * not saved, so unrelated unsaved changes on it stay unsaved. The model is
     * then brought in line with the stored values for these two columns only.
     *
     * @param  object  $stored  the locked `users` row (current stored values)
     */
    private function write(User $user, object $stored, ?int $unitId, ?int $departmentId, string $event): User
    {
        $old = $this->describe($stored->{self::COLUMN_UNIT}, $stored->{self::COLUMN_DEPARTMENT});
        $new = $this->describe($unitId, $departmentId);

        if ($old !== $new) {
            DB::table('users')->where('id', $stored->id)->update([
                self::COLUMN_UNIT => $unitId,
                self::COLUMN_DEPARTMENT => $departmentId,
                'updated_at' => now(),
            ]);
        }

        foreach ([self::COLUMN_UNIT => $unitId, self::COLUMN_DEPARTMENT => $departmentId] as $column => $value) {
            $user->setAttribute($column, $value);
            $user->syncOriginalAttribute($column);
        }

        if ($old !== $new) {
            $this->audit->record($user, $event, $old, $new);
        }

        return $user;
    }

    private function recordCleared(int $userId, array $old): void
    {
        $user = User::withTrashed()->find($userId);
        if ($user) {
            $this->audit->record($user, 'employee.primary_assignment_cleared', $old, ['type' => null, 'id' => null], 'Membership removed');
        }
    }
}
