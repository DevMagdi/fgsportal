<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rating extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ratings';
 
    protected $fillable = [
        'ask_to_rate_id',
        'question_id',
        'rate',
        'comment',
     ];
     public function ask_to_rate_id_fun()
     {
         return $this->belongsTo(AskForRate::class,'ask_to_rate_id');
     }
    
     public function question_id_fun()
     {
         return $this->belongsTo(Question::class,'question_id');
     }
     

}
