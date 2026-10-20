<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestRFPToApprove extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_r_f_p_to_approves';
    protected $fillable = [
        'request_rfp_id',
        'manager_approve_id',
        'user_creator_id',
        'status'
    
     ];
     public function request_rfp_id_fun()
     {
         return $this->belongsTo(RequestRFP::class,'request_rfp_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
     public function manager_approve_id_fun()
     {
         return $this->belongsTo(User::class,'manager_approve_id');
     }
    
}
