<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HiringRequestStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'hiring_request_statuses';
    protected $fillable = [
        'hiring_request_status',
     ];
}
 