<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalaryGross extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'salary_grosses';
    protected $fillable = [
        'user_creator_id',
        'salary_id',
        'salary_type_id',
        'status',
        'cost'
     ];

     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
     public function salary_type_id_fun()
     {
         return $this->belongsTo(SalaryType::class,'salary_type_id');
     }
     public function salary_id_fun()
     {
         return $this->belongsTo(UserSalary::class,'salary_id');
     }
}

