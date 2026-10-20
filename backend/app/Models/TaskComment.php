<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskComment extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'task_comments';
    
    protected $fillable = [
        'task_comment',
        'user_creator_id',
        'task_id',
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
   
    public function task_id_fun()
    {
        return $this->belongsTo(Task::class,'task_id');
    }
   
}
