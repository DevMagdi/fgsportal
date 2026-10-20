<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KeepNoteStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'keep_note_statuses';
    protected $fillable = [
        'keep_note_status_name',
     ];
}

