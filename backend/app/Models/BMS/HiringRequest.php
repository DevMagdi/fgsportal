<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class HiringRequest extends Model
{
    protected $table='bms_hiring_requests';
    protected $guarded=[];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function requester(){return $this->belongsTo(\App\Models\User::class,'requested_by');}
    public function candidates(){return $this->hasMany(Candidate::class,'bms_hiring_request_id');}
    public function onboarding(){return $this->hasMany(OnboardingItem::class,'bms_hiring_request_id');}
}
