<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ToDoList extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'to_do_lists';
    protected $fillable = [
        'user_creator_id',
        'keep_note_id',
        'to_do',
        'status'
     ];

     public function keep_note_id_fun()
     {
         return $this->belongsTo(KeepNote::class,'keep_note_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
  
}
