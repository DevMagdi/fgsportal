<?php
namespace App\Models\BMS;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * A central department (HR, Finance, Marketing, Central IT, Legal & Compliance…)
 * serving the whole organization.
 *
 * Deliberately separate from business units and from the legacy `departments`
 * table, which keeps driving legacy permissions, support requests and
 * onboarding. `legacyDepartment` is an optional pointer an administrator may
 * set; nothing reads it to grant access.
 */
class CentralDepartment extends Model
{
    protected $table = 'bms_central_departments';
    protected $fillable = ['code', 'name', 'name_ar', 'description', 'head_id', 'legacy_department_id', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function head()
    {
        return $this->belongsTo(User::class, 'head_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'bms_central_department_user', 'central_department_id', 'user_id')->withTimestamps();
    }

    public function legacyDepartment()
    {
        return $this->belongsTo(Department::class, 'legacy_department_id');
    }
}
