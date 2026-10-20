<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionAnswers extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'question_answers';

    protected $fillable = [
        'user_creator_id',
        'question_id',
        'answer',
     ];

     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
 
     public function question_id_fun()
     {
         return $this->belongsTo(Question::class,'question_id');
     }
     
}

