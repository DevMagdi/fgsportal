<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class PrEvent extends Model
{
    protected $table='bms_events';
    protected $guarded=[];
    protected $casts=['event_date'=>'datetime'];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function requester(){return $this->belongsTo(\App\Models\User::class,'requested_by');}
    public function checklist(){return $this->hasMany(EventChecklistItem::class,'bms_event_id');}
}
