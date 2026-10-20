<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestRFPAction extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_r_f_p_actions';
    protected $fillable = [
        'request_rfp_status_id',
        'request_rfp_approve_id',
        'comment',
     ];
     public function request_rfp_status_id_fun()
     {
         return $this->belongsTo(RequestRFPStatus::class,'request_rfp_status_id');
     }
     public function request_rfp_approve_id_fun()
     {
         return $this->belongsTo(RequestRFPToApprove::class,'request_rfp_approve_id');
     }
}
