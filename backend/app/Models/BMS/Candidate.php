<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    protected $table='bms_candidates';
    protected $guarded=[];
    protected $casts=['interview_at'=>'datetime'];
    public function hiringRequest(){return $this->belongsTo(HiringRequest::class,'bms_hiring_request_id');}
}
