<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class BusinessUnit extends Model {
    use SoftDeletes;
    protected $fillable = ['parent_id','name','slug','description','services','key_messages','director_id','development_manager_id','is_active'];
    protected $casts = ['services'=>'array','is_active'=>'boolean'];
    public function parent(){ return $this->belongsTo(self::class,'parent_id'); }
    public function children(){ return $this->hasMany(self::class,'parent_id'); }
    public function director(){ return $this->belongsTo(User::class,'director_id'); }
    public function users(){ return $this->belongsToMany(User::class)->withTimestamps(); }
    /** Stage B1: development manager of the unit — separate from the director and from team leads. */
    public function developmentManager(){ return $this->belongsTo(User::class,'development_manager_id'); }
    public function teams(){ return $this->hasMany(Team::class,'business_unit_id'); }
    /** Legacy projects linked to this unit; the pivot's is_lead marks the unit that leads a project. */
    public function projects(){ return $this->belongsToMany(\App\Models\Project::class,'bms_project_business_unit','business_unit_id','project_id')->withPivot('is_lead')->withTimestamps(); }
    /** Employees whose primary organizational assignment is this unit. */
    public function primaryUsers(){ return $this->hasMany(User::class,'primary_business_unit_id'); }
    public function weeklyPlans(){ return $this->hasMany(WeeklyPlan::class); }
    public function minutes(){ return $this->hasMany(Minutes::class,'linked_id')->where('linked_type','unit')->with('meeting'); }
}
