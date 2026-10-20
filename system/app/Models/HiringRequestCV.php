<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HiringRequestCV extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'hiring_request_c_v_s';
    protected $fillable = [
        'hiring_request_id',
        'recruitment_request_cv_id',
        'user_creator_id',
        'hiring_request_cv_status_id',
        'note',
        'interview_phase_id'
       
      ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function interview_phase_id_fun()
    {
        return $this->belongsTo(InterviewPhase::class,'interview_phase_id');
    }
    
    public function recruitment_request_cv_id_fun()
    {
        return $this->belongsTo(RecruitmentRequestCv::class,'recruitment_request_cv_id');
    }
    public function hiring_request_id_fun()
    {
        return $this->belongsTo(HiringRequest::class,'hiring_request_id');
    }
    public function hiring_request_cv_status_id_fun()
    {
        return $this->belongsTo(HiringRequestCVsStatus::class,'hiring_request_cv_status_id');
    }
      
}
 