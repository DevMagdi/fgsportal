<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class ProcurementRequest extends Model
{
    protected $table='bms_procurement_requests';
    protected $guarded=[];
    protected $casts=['budget_confirmed'=>'boolean','reviewed_at'=>'datetime'];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function requester(){return $this->belongsTo(\App\Models\User::class,'requested_by');}
    public function reviewer(){return $this->belongsTo(\App\Models\User::class,'reviewed_by');}
    public function quotations(){return $this->hasMany(ProcurementQuotation::class,'bms_procurement_request_id');}
}
