<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncentiveRequestApproved extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'incentive_request_approveds';
  
    protected $fillable = [
        'incentive_status_id',
        'assign_to_id',
        'incentive_id',
        'comment'
         
    ];

    public function assign_to_id_fun()
    {
        return $this->belongsTo(User::class,'assign_to_id');
    }
    public function incentive_id_fun()
    {
        return $this->belongsTo(IncentiveRequest::class,'incentive_id');
    }
   
    public function incentive_status_id_fun()
    {
        return $this->belongsTo(IncentiveStatus::class,'incentive_status_id');
    }
    
}

