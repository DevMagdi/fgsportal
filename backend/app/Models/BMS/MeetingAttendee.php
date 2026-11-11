<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class MeetingAttendee extends Model
{
    protected $table='bms_meeting_attendees';
    protected $guarded=[];
    protected $casts=['invited_at'=>'datetime'];
    protected $hidden=['response_token'];
    public function meeting(){return $this->belongsTo(Meeting::class,'bms_meeting_id');}
    public function user(){return $this->belongsTo(\App\Models\User::class);}
}
