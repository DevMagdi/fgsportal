<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestOnboarding extends Model
{
    
    use HasFactory,SoftDeletes;
    protected $table = 'request_onboardings';
 
    protected $fillable = [
        'recruitment_request_cv_id',
        'user_creator_id',
        'user_manager_id',
        'onboarding_requirement_id',
        'global_status_id',
        'comment',
       
    ];
   
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function user_manager_id_fun()
    {
        return $this->belongsTo(User::class,'user_manager_id');
    }
  
    public function onboarding_requirement_id_fun()
    {
        return $this->belongsTo(OnboardingRequirement::class,'onboarding_requirement_id');
    }
  
    public function global_status_id_fun()
    {
        return $this->belongsTo(GlobalStatus::class,'global_status_id');
    }
    public function recruitment_request_cv_id_fun()
    {
        return $this->belongsTo(RecruitmentRequestCv::class,'recruitment_request_cv_id');
    }
  
}
