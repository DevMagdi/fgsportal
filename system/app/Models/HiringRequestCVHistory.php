<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HiringRequestCVHistory extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'hiring_request_c_v_histories';
    protected $fillable = [
        'hiring_request_c_v_id',
        'hiring_request_cv_status_id',
        'user_creator_id',
        'note',
        'interview_phase_id'
         
      ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    
    public function hiring_request_cv_status_id_fun()
    {
        return $this->belongsTo(HiringRequestCVsStatus::class,'hiring_request_cv_status_id');
    }

    public function hiring_request_c_v_id_fun()
    {
        return $this->belongsTo(HiringRequestCV::class,'hiring_request_c_v_id');
    }
    public function interview_phase_id_fun()
    {
        return $this->belongsTo(InterviewPhase::class,'interview_phase_id');
    }
   
}
 
 