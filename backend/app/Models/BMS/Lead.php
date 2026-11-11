<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $table='bms_leads';
    protected $guarded=[];
    use \Illuminate\Database\Eloquent\SoftDeletes;
    protected $casts=['last_contacted_at'=>'datetime'];
    public function unit(){return $this->belongsTo(BusinessUnit::class,'business_unit_id');}
    public function owner(){return $this->belongsTo(\App\Models\User::class,'owner_id');}
    public function interactions(){return $this->hasMany(LeadInteraction::class,'bms_lead_id')->latest('happened_at');}
    public function opportunity(){return $this->belongsTo(Opportunity::class,'converted_opportunity_id');}
    public function minutes(){return $this->hasMany(Minutes::class,'linked_id')->where('linked_type','lead')->with('meeting');}
    public function studyItems(){return $this->hasMany(LabStudyItem::class,'bms_lead_id')->with('owner:id,username');}
}
