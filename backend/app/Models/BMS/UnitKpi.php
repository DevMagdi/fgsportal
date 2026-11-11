<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class UnitKpi extends Model
{
    protected $table='bms_unit_kpis';
    protected $guarded=[];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
}
