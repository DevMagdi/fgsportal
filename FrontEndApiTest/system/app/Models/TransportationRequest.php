<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportationRequest extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'transportation_requests';
     
    protected $fillable = [
        'transportation_request_comment',
        'transportation_request_from',
        'transportation_request_purpose',
        'transportation_request_to',
        'transportation_request_amount',
        'user_creator_id',
        'transportation_request_status_id',
        'manager_approve_id',
        'process_id',
        'transportation_request_date',
                  'created_at'

    ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
    
    public function transportation_request_status_id_fun()
    {
        return $this->belongsTo(TransportationRequestStatus::class,'transportation_request_status_id');
    }
    public function process_id_fun()
    {
        return $this->belongsTo(Process::class,'process_id');
    }
}

