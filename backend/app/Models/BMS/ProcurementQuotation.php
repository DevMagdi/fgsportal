<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class ProcurementQuotation extends Model
{
    protected $table='bms_procurement_quotations';
    protected $guarded=[];
    public function request(){return $this->belongsTo(ProcurementRequest::class,'bms_procurement_request_id');}
}
