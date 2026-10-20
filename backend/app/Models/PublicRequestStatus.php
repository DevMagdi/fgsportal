<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PublicRequestStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'public_request_statuses';
    protected $fillable = [
        'public_request_status_name',
     ];
     
}
 