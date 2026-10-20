<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectTeam extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'project_teams';
 
    protected $fillable = [
        'user_team_id',
        'user_creator_id',
        'project_id',
        'project_structure_id',
    ];
    
    public function user_team_id_fun()
    {
        return $this->belongsTo(User::class,'user_team_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function project_structure_id_fun()
    {
        return $this->belongsTo(ProjectStructure::class,'project_structure_id');
    }
    public function project_id_fun()
    {
        return $this->belongsTo(Project::class,'project_id');
    }
}
 