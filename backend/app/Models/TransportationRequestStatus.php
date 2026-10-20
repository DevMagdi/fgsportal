<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportationRequestStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'transportation_request_statuses';
    protected $fillable = [
        'transportation_request_status_name',
     ];
}
