<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessTeam extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'process_teams';
  
    protected $fillable = [
         'user_creator_id',
        'project_team_id',
        'process_id'
    ];
    
    public function process_id_fun()
    {
        return $this->belongsTo(Process::class,'process_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
  
    public function project_team_id_fun()
    {
        return $this->belongsTo(ProjectTeam::class,'project_team_id');
    }
}
 