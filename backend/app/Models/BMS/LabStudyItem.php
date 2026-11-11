<?php
namespace App\Models\BMS;
use Illuminate\Database\Eloquent\Model;
class LabStudyItem extends Model
{
    protected $table='bms_lab_study_items';protected $guarded=[];
    public function lead(){return $this->belongsTo(Lead::class,'bms_lead_id');}
    public function owner(){return $this->belongsTo(\App\Models\User::class,'owner_id');}
}
