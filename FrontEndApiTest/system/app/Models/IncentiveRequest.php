<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncentiveRequest extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'incentive_requests';
    protected $fillable = [
        'incentive_comment',
        'incentive_amount',
        'user_creator_id',
        'user_to_id',
        'manager_approve_id',
        'process_id',
        'incentive_status_id',
        'incentive_date'
    ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function user_to_id_fun()
    {
        return $this->belongsTo(User::class,'user_to_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
 
    public function incentive_status_id_fun()
    {
        return $this->belongsTo(IncentiveStatus::class,'incentive_status_id');
    }
    public function process_id_fun()
    {
        return $this->belongsTo(Process::class,'process_id');
    }
   
}

