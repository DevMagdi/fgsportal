<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'question_types';
 
    protected $fillable = [
        'question_type',
     ];
}

