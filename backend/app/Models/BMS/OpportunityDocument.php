<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class OpportunityDocument extends Model
{
    protected $table='bms_opportunity_documents';
    protected $guarded=[];
    public function opportunity(){return $this->belongsTo(Opportunity::class,'bms_opportunity_id');}
    public function uploader(){return $this->belongsTo(\App\Models\User::class,'uploaded_by');}
}
