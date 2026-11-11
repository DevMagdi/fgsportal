<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class WeeklyPlan extends Model {
    protected $fillable=['business_unit_id','week_start','objectives','next_week_plan','status','created_by','submitted_by','submitted_at'];
    protected $casts=['week_start'=>'date','submitted_at'=>'datetime'];
    public function unit(){ return $this->belongsTo(BusinessUnit::class,'business_unit_id'); }
    public function tasks(){ return $this->hasMany(UnitTask::class); }
    public function supportRequests(){ return $this->hasMany(SupportRequest::class); }
    public function creator(){ return $this->belongsTo(User::class,'created_by'); }
    public function submitter(){ return $this->belongsTo(User::class,'submitted_by'); }
}
