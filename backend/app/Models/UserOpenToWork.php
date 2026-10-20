<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserOpenToWork extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_open_to_work';
 
    protected $fillable = [
        'user_id',
        'from_date_time',
        'to_date_time',
        'active'
    ];
     
    public function user_id_fun()
    {
        return $this->belongsTo(User::class,'user_id');
    }
    
}
