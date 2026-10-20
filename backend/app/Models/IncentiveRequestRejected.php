<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncentiveRequestRejected extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'incentive_request_rejecteds';
  
    protected $fillable = [
        'rejected_by_id',
        'reject_reason',
        'incentive_id',         
    ];

    public function rejected_by_id_fun()
    {
        return $this->belongsTo(User::class,'rejected_by_id');
    }
    public function incentive_id_fun()
    {
        return $this->belongsTo(IncentiveRequest::class,'incentive_id');
    }
   
}
