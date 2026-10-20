<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PMTeamRequestProject extends Model
{
   
    use HasFactory,SoftDeletes;
    protected $table = 'p_m_team_request_projects';
 
    protected $fillable = [
        'pm_team_request_id',
        'project_id',
        'process_details',
        
    ];
    
    public function pm_team_request_id_fun()
    {
        return $this->belongsTo(PMTeamRequest::class,'pm_team_request_id');
    }
    public function project_id_fun()
    {
        return $this->belongsTo(Project::class,'project_id');
    }
   
    protected $cast =[
        "process_details"=>'array',
    ];
    
}
