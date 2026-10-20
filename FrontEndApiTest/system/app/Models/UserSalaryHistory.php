<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserSalaryHistory extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_salary_histories';
    
    protected $fillable = [
        'salary',
        'user_creator_id',
        'salary_id',
        'start_date',
        'end_date',
    ];
    
    public function salary_id_fun()
    {
        return $this->belongsTo(UserSalary::class,'salary_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
}
