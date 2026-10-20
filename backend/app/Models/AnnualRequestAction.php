<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnualRequestAction extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'annual_request_actions';
    protected $fillable = [
        'comment',
        'annual_request_id',
        'annual_status_id',
        'assign_to_id',
        'created_at'
         
    ];
    public function annual_request_id_fun()
    {
        return $this->belongsTo(AnnualRequest::class,'annual_request_id');
    }
    public function annual_status_id_fun()
    {
        return $this->belongsTo(AnnualStatus::class,'annual_status_id');
    }
   
    public function assign_to_id_fun()
    {
        return $this->belongsTo(User::class,'assign_to_id');
    }
     
}
 