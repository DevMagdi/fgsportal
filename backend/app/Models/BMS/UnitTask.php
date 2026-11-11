<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class UnitTask extends Model {
    protected $fillable=['weekly_plan_id','business_unit_id','owner_id','title','description','status','progress','blockers','due_date','updated_by'];
    protected $casts=['due_date'=>'date','progress'=>'integer'];
    public function plan(){ return $this->belongsTo(WeeklyPlan::class,'weekly_plan_id'); }
    public function unit(){ return $this->belongsTo(BusinessUnit::class,'business_unit_id'); }
    public function owner(){ return $this->belongsTo(User::class,'owner_id'); }
    public function updater(){ return $this->belongsTo(User::class,'updated_by'); }
}
