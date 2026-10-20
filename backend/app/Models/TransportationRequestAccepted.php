<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportationRequestAccepted extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'transportation_request_accepteds';
    
    protected $fillable = [
        'request_status_id',
        'assign_to_id',
        'request_id',
        'comment',
        'created_at'
        
         
    ];
    public function assign_to_id_fun()
    {
        return $this->belongsTo(User::class,'assign_to_id');
    }
    public function request_status_id_fun()
    {
        return $this->belongsTo(TransportationRequestStatus::class,'request_status_id');
    }
   
    public function request_id_fun()
    {
        return $this->belongsTo(TransportationRequest::class,'request_id');
    }
    
}

