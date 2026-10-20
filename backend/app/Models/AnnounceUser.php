<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnounceUser extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'announce_users';
    protected $fillable = [
        'user_creator_id',
        'announce_id',
        'seen',
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function announce_id_fun()
    {
        return $this->belongsTo(Announce::class,'announce_id');
    }
  
}
 