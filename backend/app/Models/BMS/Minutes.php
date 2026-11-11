<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class Minutes extends Model
{
    protected $table='bms_minutes';
    protected $guarded=[];
    protected $casts=['actions'=>'array'];
    public function meeting(){return $this->belongsTo(Meeting::class,'bms_meeting_id');}
}
