<?php
namespace App\Models\BMS;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * A team inside one business unit.
 *
 * Membership (`bms_team_user`) and the lead are assignments of existing users:
 * an employee can sit in several teams with the same single user record.
 * A team is not a reporting line — `users.manager_id` is unrelated — and not a
 * project team (`project_teams`).
 *
 * Teams are archived with `is_active`; they are not soft-deleted, so the
 * (business unit, name) uniqueness is a plain database constraint.
 */
class Team extends Model
{
    protected $table = 'bms_teams';
    protected $fillable = ['business_unit_id', 'name', 'description', 'lead_id', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class, 'business_unit_id');
    }

    public function lead()
    {
        return $this->belongsTo(User::class, 'lead_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'bms_team_user', 'team_id', 'user_id')->withTimestamps();
    }
}
