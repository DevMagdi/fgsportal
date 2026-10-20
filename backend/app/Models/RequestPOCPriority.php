<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestPOCPriority extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_p_o_c_priorities';
    protected $fillable = [
        'reqeust_poc_priority_name',
        

     ];
}
