<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class OpportunityStageHistory extends Model {
    protected $fillable=['bms_opportunity_id','from_stage','to_stage','note','changed_by'];
    public function opportunity(){ return $this->belongsTo(Opportunity::class,'bms_opportunity_id'); }
    public function user(){ return $this->belongsTo(User::class,'changed_by'); }
}
