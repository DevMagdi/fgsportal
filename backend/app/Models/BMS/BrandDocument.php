<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class BrandDocument extends Model
{
    protected $table='bms_documents';
    protected $guarded=[];
    protected $casts=['is_latest'=>'boolean','is_published'=>'boolean'];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function uploader(){return $this->belongsTo(\App\Models\User::class,'uploaded_by');}
}
