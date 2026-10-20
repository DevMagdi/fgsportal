<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportationRequestRejected extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'transportation_request_rejecteds';
    
    protected $fillable = [
        'reject_reason',
        'rejected_by_id',
        'request_id',
                'created_at'

         
    ];
    public function rejected_by_id_fun()
    {
        return $this->belongsTo(User::class,'rejected_by_id');
    }
   
   
    public function request_id_fun()
    {
        return $this->belongsTo(TransportationRequest::class,'request_id');
    }
    
}