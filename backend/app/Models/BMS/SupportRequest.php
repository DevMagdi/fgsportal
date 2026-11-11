<?php
namespace App\Models\BMS;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class SupportRequest extends Model {
    protected $fillable=['weekly_plan_id','business_unit_id','department_id','requested_by','title','details','status','response','responded_by','responded_at'];
    protected $casts=['responded_at'=>'datetime'];
    public function unit(){ return $this->belongsTo(BusinessUnit::class,'business_unit_id'); }
    public function department(){ return $this->belongsTo(Department::class); }
    public function requester(){ return $this->belongsTo(User::class,'requested_by'); }
    public function responder(){ return $this->belongsTo(User::class,'responded_by'); }
    public function plan(){ return $this->belongsTo(WeeklyPlan::class,'weekly_plan_id'); }
}
