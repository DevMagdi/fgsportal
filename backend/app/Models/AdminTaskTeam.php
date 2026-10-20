<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminTaskTeam extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'admin_task_teams';
  
    protected $fillable = [
        'user_id',
        'task_id',
    ];
    
    
    public function user_id_fun()
    {
        return $this->belongsTo(User::class,'user_id');
    }
   
    public function task_id_fun()
    {
        return $this->belongsTo(AdminTask::class,'task_id');
    }
   
}
