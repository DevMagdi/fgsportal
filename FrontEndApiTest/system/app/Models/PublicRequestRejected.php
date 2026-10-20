<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PublicRequestRejected extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'public_request_rejecteds';
   
    protected $fillable = [
        'rejected_by_id',
        'reject_reason',
        'public_request_id',
         'created_at'
        
         
    ];
    public function rejected_by_id_fun()
    {
        return $this->belongsTo(User::class,'rejected_by_id');
    }
    public function public_request_id_fun()
    {
        return $this->belongsTo(PublicRequest::class,'public_request_id');
    }
   
    
    
}

