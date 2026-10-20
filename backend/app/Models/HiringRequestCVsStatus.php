<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HiringRequestCVsStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'hiring_request_c_vs_statuses';
    protected $fillable = [
        'hiring_request_cv_status',
     ];
}
