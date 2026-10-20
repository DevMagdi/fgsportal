<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalaryType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'salary_types';
    protected $fillable = [
        'salary_type',
        'user_creator_id',

     ];
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
  
}

