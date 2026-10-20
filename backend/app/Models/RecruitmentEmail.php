<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecruitmentEmail extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'recruitment_emails';
 
    protected $fillable = [
        'recruitment_request_cv_id',
        'user_creator_id',
        'email_type_id',
        'comment',
        'email_body',
        'email_attachments',
        'email_subject'
         
     ];
     public function recruitment_request_cv_id_fun()
     {
         return $this->belongsTo(RecruitmentRequestCv::class,'recruitment_request_cv_id');
     }
   
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
  
    public function email_type_id_fun()
    {
        return $this->belongsTo(RecruitmentEmailType::class,'email_type_id');
    }
    protected $casts=[
        'email_attachments'=>'array',
    ];
  
}
 