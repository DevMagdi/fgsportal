<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KeepNoteUser extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'keep_note_users';
    protected $fillable = [
        'user_id',
        'keep_note_id',
        'can_write'
     ];

     public function user_id_fun()
     {
         return $this->belongsTo(User::class,'user_id');
     }
     public function keep_note_id_fun()
     {
         return $this->belongsTo(KeepNote::class,'keep_note_id');
     }
    
}

