<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class EventChecklistItem extends Model
{
    protected $table='bms_event_checklist_items';
    protected $guarded=[];
    public function owner(){return $this->belongsTo(\App\Models\User::class,'owner_id');}
    public function event(){return $this->belongsTo(PrEvent::class,'bms_event_id');}
}
