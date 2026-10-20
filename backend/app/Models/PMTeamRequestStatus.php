<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PMTeamRequestStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'p_m_team_request_statuses';
    protected $fillable = [
        'pm_team_request_status',
     ];
}