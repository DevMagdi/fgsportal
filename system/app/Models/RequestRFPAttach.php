<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestRFPAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_r_f_p_attaches';
    protected $fillable = [
        'request_rfp_id',
        'request_rfp_attach',
        'user_creator_id',
      
     ];
     public function request_rfp_id_fun()
     {
         return $this->belongsTo(RequestRFP::class,'request_rfp_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
   
    
}
