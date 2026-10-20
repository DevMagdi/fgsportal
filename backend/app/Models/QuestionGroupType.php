<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionGroupType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'question_group_types';
 
    protected $fillable = [
        'group_type_name',
     ];

}

