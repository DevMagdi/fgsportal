<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PublicRequestAccepted extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'public_request_accepteds';
     
    protected $fillable = [
        'public_request_status_id',
        'assign_to_id',
        'public_request_id',
        'comment',
         'created_at'
         
    ];
    public function assign_to_id_fun()
    {
        return $this->belongsTo(User::class,'assign_to_id');
    }
    public function public_request_id_fun()
    {
        return $this->belongsTo(PublicRequest::class,'public_request_id');
    }
   
    public function public_request_status_id_fun()
    {
        return $this->belongsTo(PublicRequestStatus::class,'public_request_status_id');
    }
    
}

