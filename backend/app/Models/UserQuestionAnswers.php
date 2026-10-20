<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserQuestionAnswers extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_question_answers';

    protected $fillable = [
        'question_answer_id',
        'ask_to_rate_id',
     ];

     public function ask_to_rate_id_fun()
     {
         return $this->belongsTo(AskForRate::class,'ask_to_rate_id');
     }
 
     public function question_answer_id_fun()
     {
         return $this->belongsTo(QuestionAnswers::class,'question_answer_id');
     }
     
}
