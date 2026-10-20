<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecruitmentRequestHistory extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'recruitment_request_histories';
 
    protected $fillable = [
        'recruitment_request_cv_id',
        'user_creator_id',
        'manager_interview_id',
        'interview_phase_id',
        'interview_status_id',
        'comment',
        'interview_date',
        'interviewer_comment'
    ];
   
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function manager_interview_id_fun()
    {
        return $this->belongsTo(User::class,'manager_interview_id');
    }
  
    public function interview_phase_id_fun()
    {
        return $this->belongsTo(InterviewPhase::class,'interview_phase_id');
    }
  
    public function interview_status_id_fun()
    {
        return $this->belongsTo(InterviewStatus::class,'interview_status_id');
    }
    public function recruitment_request_cv_id_fun()
    {
        return $this->belongsTo(RecruitmentRequestCv::class,'recruitment_request_cv_id');
    }
  
}
