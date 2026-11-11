<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class EmployeeCertificate extends Model
{
    protected $table='bms_employee_certificates';
    protected $guarded=[];
    public function employee(){return $this->belongsTo(\App\Models\User::class,'user_id');}
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
}
