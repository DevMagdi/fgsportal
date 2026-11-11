<?php
namespace App\Models\BMS;
use Illuminate\Database\Eloquent\Model;
class BmsAlert extends Model
{
    protected $table='bms_alerts';protected $guarded=[];protected $casts=['read_at'=>'datetime'];
    public function opportunity(){return $this->belongsTo(Opportunity::class,'bms_opportunity_id');}
    public function user(){return $this->belongsTo(\App\Models\User::class);}
}
