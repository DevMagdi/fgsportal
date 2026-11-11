<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $table='bms_meetings';
    protected $guarded=[];
    protected $casts=['starts_at'=>'datetime','ends_at'=>'datetime'];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function attendees(){return $this->hasMany(MeetingAttendee::class,'bms_meeting_id');}
    public function minutes(){return $this->hasOne(Minutes::class,'bms_meeting_id');}
    public function creator(){return $this->belongsTo(\App\Models\User::class,'created_by');}
}
