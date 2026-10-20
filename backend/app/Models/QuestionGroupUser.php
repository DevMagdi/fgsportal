<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionGroupUser extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'question_group_users';
 
    protected $fillable = [
        'user_id',
        'user_creator_id',
        'question_group_id',
     ];
     public function user_id_fun()
     {
         return $this->belongsTo(User::class,'user_id');
     }
    
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
    
     public function question_group_id_fun()
     {
         return $this->belongsTo(QuestionGroup::class,'question_group_id');
     }
     

}

