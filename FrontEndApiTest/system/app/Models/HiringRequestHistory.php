<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HiringRequestHistory extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'hiring_request_histories';
    protected $fillable = [
        'hiring_request_id',
        'hiring_request_status_id',
        'user_creator_id',
        'note',
         
      ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    
    public function hiring_request_status_id_fun()
    {
        return $this->belongsTo(HiringRequestStatus::class,'hiring_request_status_id');
    }

    public function hiring_request_id_fun()
    {
        return $this->belongsTo(HiringRequest::class,'hiring_request_id');
    }
   
}
 