<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecruitmentRequestCv extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'recruitment_request_cvs';
 
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'file_name',
        'job_title_id',
        'uploaded_by_id',
        'note',
        'graduated_year',
        'experience',
        'address',
        'job_skills_id'
      ];
   
    public function uploaded_by_id_fun()
    {
        return $this->belongsTo(User::class,'uploaded_by_id');
    }
  
    
  
    protected $casts=[
        'job_title_id'=>'array',
        'job_skills_id'=>'array',
    ];
  
}
 