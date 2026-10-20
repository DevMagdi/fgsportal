<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'tasks';
  
    protected $fillable = [
        'task_title',
        'task_progress',
        'task_description',
        'task_hours',
        'user_creator_id',
        'task_status_id',
        'task_type_id',
        'process_id',
        'task_start_date',
        'task_end_date',
        'firebasekey',
        'created_at',
        'seniorapprove'
    ];
    
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
   
    public function task_status_id_fun()
    {
        return $this->belongsTo(TaskStatus::class,'task_status_id');
    }
    public function task_type_id_fun()
    {
        return $this->belongsTo(TaskType::class,'task_type_id');
    }
    public function process_id_fun()
    {
        return $this->belongsTo(Process::class,'process_id');
    }
}
