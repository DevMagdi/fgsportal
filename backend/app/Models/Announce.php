<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announce extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'announces';
    protected $fillable = [
        'user_creator_id',
        'title',
        'body',
        'lang',
        'attach',
        'client',
        'user',
         'start',
         
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
  
}
 