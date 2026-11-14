<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'projects';
 
    protected $fillable = [
        'project_title',
        'project_progress',
        'project_description',
        'project_duration',
        'project_budget',
        'user_creator_id',
        'project_type_id',
        'project_convert_id',
        'project_status_id',
        'partner_id',
        'project_start_date',
        'project_end_date',
         'project_actual_cost',
         'idelHours',
         'firebasekey',
         'created_at',
         'cloned_id'
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function project_type_id_fun()
    {
        return $this->belongsTo(ProjectType::class,'project_type_id');
    }
    public function project_convert_id_fun()
    {
        return $this->belongsTo(Project::class,'project_convert_id');
    }
    public function project_status_id_fun()
    {
        return $this->belongsTo(ProjectStatus::class,'project_status_id');
    }
    public function partner_id_fun()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }

    /**
     * Business units this project is linked to (Stage B1). A project may involve
     * several units; the pivot's `is_lead` marks the leading one. The link is
     * informational: it does not grant access to the project.
     */
    public function businessUnits()
    {
        return $this->belongsToMany(\App\Models\BMS\BusinessUnit::class, 'bms_project_business_unit', 'project_id', 'business_unit_id')
            ->withPivot('is_lead')->withTimestamps();
    }
}
