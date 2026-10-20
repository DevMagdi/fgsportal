<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KeepNoteReplay extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'keep_note_replays';
    protected $fillable = [
        'keep_note_user_id',
        'note_replay',
     ];

     public function keep_note_user_id_fun()
     {
         return $this->belongsTo(KeepNoteUser::class,'keep_note_user_id');
     }
  
}
