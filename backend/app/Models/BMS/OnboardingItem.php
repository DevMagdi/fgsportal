<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class OnboardingItem extends Model
{
    protected $table='bms_onboarding_items';
    protected $guarded=[];
    protected $casts=['completed_at'=>'datetime'];
    public function owner(){return $this->belongsTo(\App\Models\User::class,'owner_id');}
    public function employee(){return $this->belongsTo(\App\Models\User::class,'employee_id');}
    public function hiringRequest(){return $this->belongsTo(HiringRequest::class,'bms_hiring_request_id');}
}
