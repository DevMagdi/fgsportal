<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Team;
use App\Services\BMS\BmsAccess;
use App\Services\BMS\BmsAudit;
use App\Services\BMS\TeamStructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Stage B2 — teams inside a business unit, their members and lead, and the
 * unit's development manager. Rules live in App\Services\BMS\TeamStructure.
 */
class TeamController extends BmsController
{
    private const PERSON = 'id,username,firstname,lastname,email';

    private TeamStructure $teams;

    public function __construct(BmsAccess $access, BmsAudit $audit, TeamStructure $teams)
    {
        parent::__construct($access, $audit);
        $this->teams = $teams;
    }

    public function index(Request $request)
    {
        $filters = $request->validate([
            'business_unit_id' => 'nullable|integer|exists:business_units,id',
            'active' => 'nullable|boolean',
        ]);

        $query = Team::query();
        $visible = $this->access->visibleUnitIds();
        if (!empty($filters['business_unit_id'])) {
            $this->access->authorizeUnit((int) $filters['business_unit_id']);
            $query->where('business_unit_id', (int) $filters['business_unit_id']);
        } elseif ($visible !== null) {
            $query->whereIn('business_unit_id', $visible);
        }
        // Teams of deleted units are not listed.
        $query->whereHas('businessUnit');
        if (array_key_exists('active', $filters) && $filters['active'] !== null) {
            $query->where('is_active', (bool) $filters['active']);
        }

        $teams = $this->withRelations($query)->orderBy('business_unit_id')->orderBy('name')->get();

        return $this->ok($teams->map(fn (Team $team) => $this->present($team))->values());
    }

    public function show(Team $team)
    {
        $this->access->authorizeUnit((int) $team->business_unit_id);

        return $this->ok($this->present($this->reload($team)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'business_unit_id' => ['required', 'integer', Rule::exists('business_units', 'id')->whereNull('deleted_at')],
            'name' => 'required|string|max:150',
            'description' => 'nullable|string|max:5000',
            'is_active' => 'sometimes|boolean',
            'lead_id' => ['nullable', 'integer', Rule::exists('users', 'id')->whereNull('deleted_at')],
            'user_ids' => 'sometimes|array',
            'user_ids.*' => ['integer', 'distinct', Rule::exists('users', 'id')->whereNull('deleted_at')],
        ]);
        $unitId = (int) $data['business_unit_id'];
        $this->teams->authorizeManageUnit($unitId);
        $this->assertNameIsFree($unitId, $data['name']);

        $team = DB::transaction(function () use ($data, $unitId) {
            $team = Team::create([
                'business_unit_id' => $unitId,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'is_active' => array_key_exists('is_active', $data) ? (bool) $data['is_active'] : true,
            ]);
            $this->audit->record($team, 'team.created', [], $team->only(['business_unit_id', 'name', 'description', 'is_active']));

            $leadId = !empty($data['lead_id']) ? (int) $data['lead_id'] : null;
            $members = array_map('intval', $data['user_ids'] ?? []);
            if ($leadId) $members[] = $leadId;
            if ($members) $this->teams->syncMembers($team, $members);
            if ($leadId) $this->teams->setLead($team, $leadId);

            return $team;
        });

        return $this->ok($this->present($this->reload($team)), 'Team created', 201);
    }

    public function update(Request $request, Team $team)
    {
        $unitId = (int) $team->business_unit_id;
        $this->teams->authorizeManageUnit($unitId);
        $data = $request->validate([
            'business_unit_id' => 'sometimes|integer',
            'name' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string|max:5000',
            'is_active' => 'sometimes|boolean',
            'lead_id' => ['nullable', 'integer', Rule::exists('users', 'id')->whereNull('deleted_at')],
            'user_ids' => 'sometimes|array',
            'user_ids.*' => ['integer', 'distinct', Rule::exists('users', 'id')->whereNull('deleted_at')],
        ]);
        abort_if(
            array_key_exists('business_unit_id', $data) && (int) $data['business_unit_id'] !== $unitId,
            422,
            'A team cannot be moved to another business unit. Create a new team in that unit instead.'
        );
        if (array_key_exists('name', $data)) $this->assertNameIsFree($unitId, $data['name'], $team->id);

        DB::transaction(function () use ($team, $data) {
            $attributes = array_intersect_key($data, array_flip(['name', 'description', 'is_active']));
            if ($attributes) {
                $old = $team->only(array_keys($attributes));
                $team->update($attributes);
                $new = $team->only(array_keys($attributes));
                if ($old != $new) {
                    $this->audit->record($team, 'team.updated', $old, $new);
                }
            }

            $currentLead = $team->lead_id ? (int) $team->lead_id : null;
            $leadId = array_key_exists('lead_id', $data)
                ? ($data['lead_id'] !== null ? (int) $data['lead_id'] : null)
                : $currentLead;
            $changesLead = $leadId !== $currentLead;

            if (array_key_exists('user_ids', $data)) {
                $members = array_map('intval', $data['user_ids']);
                if ($changesLead) {
                    // The lead changes in the same request: release the old lead first,
                    // so the new member list is judged against the new lead.
                    $this->teams->setLead($team, null);
                    if ($leadId) $members[] = $leadId;
                }
                $this->teams->syncMembers($team, $members);
            }
            if ($changesLead) $this->teams->setLead($team, $leadId);
        });

        return $this->ok($this->present($this->reload($team)), 'Team updated');
    }

    public function destroy(Team $team)
    {
        $this->teams->authorizeManageUnit((int) $team->business_unit_id);
        $this->teams->delete($team);

        return $this->ok(null, 'Team deleted');
    }

    /** Replace the member list. Allowed to the unit's team managers and to the team's own lead. */
    public function members(Request $request, Team $team)
    {
        abort_unless($this->teams->canManageMembers($team), 403, 'You may not change the members of this team.');
        $data = $request->validate([
            'user_ids' => 'present|array',
            'user_ids.*' => ['integer', 'distinct', Rule::exists('users', 'id')->whereNull('deleted_at')],
        ]);
        $this->teams->syncMembers($team, array_map('intval', $data['user_ids']));

        return $this->ok($this->present($this->reload($team)), 'Team members updated');
    }

    /** Assign or remove (lead_id: null) the team lead. */
    public function lead(Request $request, Team $team)
    {
        $this->teams->authorizeManageUnit((int) $team->business_unit_id);
        $data = $request->validate([
            'lead_id' => ['present', 'nullable', 'integer', Rule::exists('users', 'id')->whereNull('deleted_at')],
        ]);
        $this->teams->setLead($team, $data['lead_id'] !== null ? (int) $data['lead_id'] : null);

        return $this->ok($this->present($this->reload($team)), $data['lead_id'] !== null ? 'Team lead assigned' : 'Team lead removed');
    }

    /** Assign or remove (user_id: null) the development manager of a business unit. */
    public function developmentManager(Request $request, BusinessUnit $unit)
    {
        $this->teams->authorizeManageUnit((int) $unit->id);
        $data = $request->validate([
            'user_id' => ['present', 'nullable', 'integer', Rule::exists('users', 'id')->whereNull('deleted_at')],
        ]);
        $unit = $this->teams->setDevelopmentManager($unit, $data['user_id'] !== null ? (int) $data['user_id'] : null);

        return $this->ok(
            $unit->load(['parent', 'director', 'developmentManager:'.self::PERSON, 'users']),
            $data['user_id'] !== null ? 'Development manager assigned' : 'Development manager removed'
        );
    }

    private function assertNameIsFree(int $unitId, string $name, ?int $ignoreId = null): void
    {
        $taken = Team::where('business_unit_id', $unitId)->where('name', $name)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists();
        if ($taken) {
            throw \Illuminate\Validation\ValidationException::withMessages(['name' => ['This business unit already has a team with this name.']]);
        }
    }

    private function withRelations($query)
    {
        return $query->with(['businessUnit:id,name,slug,is_active', 'lead:'.self::PERSON, 'users:'.self::PERSON]);
    }

    private function reload(Team $team): Team
    {
        return $this->withRelations(Team::query())->findOrFail($team->id);
    }

    private function present(Team $team): array
    {
        $person = fn ($user) => $user ? $user->only(['id', 'username', 'firstname', 'lastname', 'email']) : null;

        return [
            'id' => $team->id,
            'business_unit_id' => (int) $team->business_unit_id,
            'business_unit' => $team->businessUnit ? $team->businessUnit->only(['id', 'name', 'slug', 'is_active']) : null,
            'name' => $team->name,
            'description' => $team->description,
            'is_active' => (bool) $team->is_active,
            'lead_id' => $team->lead_id ? (int) $team->lead_id : null,
            'lead' => $person($team->lead),
            'members' => $team->users->sortBy('id')->map($person)->values()->all(),
            'members_count' => $team->users->count(),
            'can_manage' => $this->teams->canManageUnit((int) $team->business_unit_id),
            'can_manage_members' => $this->teams->canManageMembers($team),
            'created_at' => $team->created_at,
            'updated_at' => $team->updated_at,
        ];
    }
}
