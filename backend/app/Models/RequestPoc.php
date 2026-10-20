<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestPoc extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_pocs';
    protected $fillable = [
        'contact_lead_id',
        'user_creator_id',
        'request_poc_status_id',
        'request_poc_priority_id',
        'product_id',
        'project_id',
        'description',
        'manager_approve_id',
        'request_poc_title'
     ];
     public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
    public function contact_lead_id_fun()
    {
        return $this->belongsTo(ContactLead::class,'contact_lead_id');
    }
    public function request_poc_status_id_fun()
    {
        return $this->belongsTo(RequestPOCStatus::class,'request_poc_status_id');
    }
    public function request_poc_priority_id_fun()
    {
        return $this->belongsTo(RequestPOCPriority::class,'request_poc_priority_id');
    }
    public function product_id_fun()
    {
        return $this->belongsTo(Product::class,'product_id');
    }
    public function project_id_fun()
    {
        return $this->belongsTo(Project::class,'project_id');
    }
   
}

