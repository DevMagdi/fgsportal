<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HiringRequest extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'hiring_requests';
 
    protected $fillable = [
        'hiring_request_status_id',
        'user_creator_id',
        'user_manager_id',
        'last_action_id',
        'job_skills_id',
        'job_title_id',
        'Experience',
        'note',
       'title'
      ];
   
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function last_action_id_fun()
    {
        return $this->belongsTo(User::class,'last_action_id');
    }
    
    public function user_manager_id_fun()
    {
        return $this->belongsTo(User::class,'user_manager_id');
    }
    public function hiring_request_status_id_fun()
    {
        return $this->belongsTo(HiringRequestStatus::class,'hiring_request_status_id');
    }
    
   protected $casts=[
        'job_title_id'=>'array',
        'job_skills_id'=>'array',
    ];
  
}
 