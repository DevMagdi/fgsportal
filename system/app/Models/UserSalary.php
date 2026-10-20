<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserSalary extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_salaries';
   
    protected $fillable = [
        'salary',
        'user_creator_id',
        'assign_to_id',
        'start_date',
        'last_payment','firebasekey','created_at'
    ];
    
    public function assign_to_id_fun()
    {
        return $this->belongsTo(User::class,'assign_to_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
}
