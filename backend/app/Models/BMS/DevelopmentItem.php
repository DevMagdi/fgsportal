<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class DevelopmentItem extends Model
{
    protected $table='bms_development_items';
    protected $guarded=[];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function owner(){return $this->belongsTo(\App\Models\User::class,'owner_id');}
}
