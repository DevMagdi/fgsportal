<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements JWTSubject
{
     use HasApiTokens, HasFactory, Notifiable,SoftDeletes;
    protected $table = 'users';
   
     
    protected $fillable = [
        'username',
        'firstname',
        'lastname',
        'email',
        'password',
        'photoURL',
        'user_creator_id',
        'gender',
        'mobileNumber',
        'active',
        'user_details_id',
        'work_degrees_id',
        'refreshRequired',
        'token',
           'firebasekey',
        'branches_id',
        'sub_departments_id',
        'company_id',
        'canAddPreviousReports',
        'canAddPreviousReportsDate',
        'open_to_work'

    ];

    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function sub_departments_id_fun()
    {
        return $this->belongsTo(SubDepartment::class,'sub_departments_id');
    }
    
    
    public function user_details_id_fun()
    {
        return $this->belongsTo(UserDetail::class,'user_details_id');
    }
    public function work_degrees_id_fun()
    {
        return $this->belongsTo(WorkDegree::class,'work_degrees_id');
    }
    public function branches_id_fun()
    {
        return $this->belongsTo(Branch::class,'branches_id');
    }

    /**
     * Tenant company whose module entitlements apply to this user.
     */
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    /**
     * Convenience helper: is the given module enabled for this user's company?
     */
    public function hasModule(string $moduleSlug): bool
    {
        return app(\App\Services\ModuleService::class)->isEnabled($moduleSlug, $this);
    }

    public function businessUnits()
    {
        return $this->belongsToMany(\App\Models\BMS\BusinessUnit::class)->withTimestamps();
    }

    /** Reporting line used by employee administration (BRD §4.1). */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function reports()
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    public function bmsRoles()
    {
        return $this->belongsToMany(\App\Models\BMS\BmsRole::class, 'bms_role_user')
            ->withPivot('business_unit_id')->withTimestamps();
    }

    /*
     * Organization structure (Stage B1). One user record, several independent
     * relationships: unit membership (businessUnits), team membership, central
     * department membership, the reporting line (manager) and project
     * assignments (project_teams) never replace one another.
     */

    /** Teams the employee is a member of. */
    public function teams()
    {
        return $this->belongsToMany(\App\Models\BMS\Team::class, 'bms_team_user', 'user_id', 'team_id')->withTimestamps();
    }

    /** Teams the employee leads. */
    public function ledTeams()
    {
        return $this->hasMany(\App\Models\BMS\Team::class, 'lead_id');
    }

    /** Business units whose development manager is this employee. */
    public function developmentManagedUnits()
    {
        return $this->hasMany(\App\Models\BMS\BusinessUnit::class, 'development_manager_id');
    }

    /** Central departments the employee is a member of. */
    public function centralDepartments()
    {
        return $this->belongsToMany(\App\Models\BMS\CentralDepartment::class, 'bms_central_department_user', 'user_id', 'central_department_id')->withTimestamps();
    }

    /** Central departments the employee heads. */
    public function headedCentralDepartments()
    {
        return $this->hasMany(\App\Models\BMS\CentralDepartment::class, 'head_id');
    }

    /**
     * Primary organizational assignment: a business unit OR a central
     * department, never both, and always one the employee is a member of.
     * Written only through App\Services\BMS\PrimaryAssignment.
     */
    public function primaryBusinessUnit()
    {
        return $this->belongsTo(\App\Models\BMS\BusinessUnit::class, 'primary_business_unit_id');
    }

    public function primaryCentralDepartment()
    {
        return $this->belongsTo(\App\Models\BMS\CentralDepartment::class, 'primary_central_department_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
     ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    
    
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims() {
        return [];
    }    
}
