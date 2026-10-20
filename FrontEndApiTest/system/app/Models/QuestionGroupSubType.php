<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionGroupSubType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'question_group_sub_types';
 
    protected $fillable = [
        'group_type_id',
       'group_sub_type'
     ];
    
     public function group_type_id_fun()
    {
        return $this->belongsTo(QuestionGroupType::class,'group_type_id');
    }

  

}
