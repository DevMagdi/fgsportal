<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class LeadInteraction extends Model
{
    protected $table='bms_lead_interactions';
    protected $guarded=[];
    protected $casts=['happened_at'=>'datetime'];
    public function lead(){return $this->belongsTo(Lead::class,'bms_lead_id');}
    public function creator(){return $this->belongsTo(\App\Models\User::class,'created_by');}
}
