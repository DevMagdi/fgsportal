<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KeepNotes extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'keep_notes';
    
    protected $fillable = [
        'note',
        'note_date',
        'user_creator_id',
        'project_id',
    ];

    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function project_id_fun()
    {
        return $this->belongsTo(Project::class,'project_id');
    }
}
