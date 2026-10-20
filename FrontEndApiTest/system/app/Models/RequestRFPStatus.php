<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestRFPStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_r_f_p_statuses';
    protected $fillable = [
        'request_rfp_status',
    
     ];
}
