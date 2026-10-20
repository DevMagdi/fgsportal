<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'questions';
 
    protected $fillable = [
        'user_creator_id',
        'question_group_id',
        'question_type_id',
        'question',
        'isMulti'
        
     ];

     public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function question_group_id_fun()
    {
        return $this->belongsTo(QuestionGroup::class,'question_group_id');
    }
    public function question_type_id_fun()
    {
        return $this->belongsTo(QuestionType::class,'question_type_id');
    }
    
}
