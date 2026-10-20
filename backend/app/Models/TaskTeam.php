<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskTeam extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'task_teams';
    
    protected $fillable = [
        'process_team_id',
        'user_creator_id',
        'task_id',
        'task_structure_id',
    ];
    
    public function process_team_id_fun()
    {
        return $this->belongsTo(ProcessTeam::class,'process_team_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function task_structure_id_fun()
    {
        return $this->belongsTo(TaskStructure::class,'task_structure_id');
    }
    public function task_id_fun()
    {
        return $this->belongsTo(Task::class,'task_id');
    }
}
 