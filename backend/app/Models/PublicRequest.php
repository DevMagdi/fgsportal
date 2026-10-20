<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PublicRequest extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'public_requests';
   
    protected $fillable = [
        'public_request_details',
        'public_request_amount',
        'user_creator_id',
        'public_request_status_id',
        'manager_approve_id',
        'process_id',
         'public_request_title',
         'sub_departments_id',
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
 
    public function public_request_status_id_fun()
    {
        return $this->belongsTo(PublicRequestStatus::class,'public_request_status_id');
    }
    public function process_id_fun()
    {
        return $this->belongsTo(Process::class,'process_id');
    }
    public function sub_departments_id_fun()
    {
        return $this->belongsTo(SubDepartment::class,'sub_departments_id');
    }
}

