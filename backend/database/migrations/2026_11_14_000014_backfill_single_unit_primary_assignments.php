<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Stage B1 — primary assignment for employees whose answer is unambiguous.
 *
 * An employee who belongs to exactly ONE business unit gets that unit as the
 * primary assignment. Nothing is guessed:
 *  - employees in several units are left without a primary assignment, for an
 *    administrator to decide;
 *  - employees in no unit are left untouched;
 *  - an employee who already has a primary assignment (unit or central
 *    department) is never changed, so re-running is safe;
 *  - memberships of soft-deleted units and soft-deleted employees are ignored.
 *
 * Central departments have no members when this runs (they are introduced by
 * the same release), so they cannot make a single-unit employee ambiguous.
 *
 * `down()` does not touch data: the columns themselves are removed by the
 * schema migration's rollback.
 */
class BackfillSingleUnitPrimaryAssignments extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('business_unit_user') || !Schema::hasColumn('users', 'primary_business_unit_id')) return;

        $single = DB::table('business_unit_user')
            ->join('business_units', 'business_units.id', '=', 'business_unit_user.business_unit_id')
            ->whereNull('business_units.deleted_at')
            ->groupBy('business_unit_user.user_id')
            ->havingRaw('COUNT(*) = 1')
            ->selectRaw('business_unit_user.user_id as user_id, MIN(business_unit_user.business_unit_id) as business_unit_id')
            ->orderBy('business_unit_user.user_id')
            ->get();

        foreach ($single as $row) {
            $query = DB::table('users')->where('id', $row->user_id)
                ->whereNull('deleted_at')
                ->whereNull('primary_business_unit_id');
            if (Schema::hasColumn('users', 'primary_central_department_id')) {
                $query->whereNull('primary_central_department_id');
            }
            $query->update(['primary_business_unit_id' => $row->business_unit_id]);
        }
    }

    public function down(): void
    {
        // Data only; see the class comment.
    }
}
