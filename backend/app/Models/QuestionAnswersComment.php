<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionAnswersComment extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'question_answers_comments';

    protected $fillable = [
        'user_question_answer_id',
        'comment',
     ];

 
     public function user_question_answer_id_fun()
     {
         return $this->belongsTo(UserQuestionAnswers::class,'user_question_answer_id');
     }
     
}


