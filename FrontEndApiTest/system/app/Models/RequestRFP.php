<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestRFP extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_r_f_p_s';
    protected $fillable = [
        'request_rfp_title',
        'contact_lead_id',
        'user_creator_id',
        'request_rfp_status_id',
        'comment',
    
     ];
     public function contact_lead_id_fun()
     {
         return $this->belongsTo(ContactLead::class,'contact_lead_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
     public function request_rfp_status_id_fun()
     {
         return $this->belongsTo(RequestRFPStatus::class,'request_rfp_status_id');
     }
    
}

