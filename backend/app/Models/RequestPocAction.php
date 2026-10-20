<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestPocAction extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_poc_actions';
    protected $fillable = [
        'request_poc_id',
        'user_creator_id',
        'request_poc_status_id',
        'request_poc_priority_id',
        'comment',
        'poc_action_attach',
     ];
     
    public function request_poc_id_fun()
    {
        return $this->belongsTo(RequestPoc::class,'request_poc_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function request_poc_status_id_fun()
    {
        return $this->belongsTo(RequestPOCStatus::class,'request_poc_status_id');
    }
    public function request_poc_priority_id_fun()
    {
        return $this->belongsTo(RequestPOCPriority::class,'request_poc_priority_id');
    }
   
}

 