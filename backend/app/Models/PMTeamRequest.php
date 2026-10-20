<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PMTeamRequest extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'p_m_team_requests';
 
    protected $fillable = [
        'team_request_title',
        'team_request_description',
        'team_request_status_id',
        'user_creator_id',
        'manager_approve_id',
        'for_date',
        'developer_team',
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function team_request_status_id_fun()
    {
        return $this->belongsTo(PMTeamRequestStatus::class,'team_request_status_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
    protected $cast =[
        "developer_team"=>'array',
    ];
    
}
