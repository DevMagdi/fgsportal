<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserViolence extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_violences';
  
    protected $fillable = [
        'user_violence_message',
        'user_id',
            
    ];
    public function user_id_fun()
    {
        return $this->belongsTo(User::class,'user_id');
    }
   
}

