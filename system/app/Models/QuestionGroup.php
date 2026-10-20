<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionGroup extends Model
{
     
    use HasFactory,SoftDeletes;
    protected $table = 'question_groups';
 
    protected $fillable = [
        'user_creator_id',
        'question_group_title',
       'group_sub_type_id',
       'status'
        
     ];
    
     public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }

    public function group_sub_type_id_fun()
    {
        return $this->belongsTo(QuestionGroupSubType::class,'group_sub_type_id');
    }
    
}

