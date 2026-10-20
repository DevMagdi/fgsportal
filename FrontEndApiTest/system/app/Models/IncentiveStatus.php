<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IncentiveStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'incentive_statuses';
    protected $fillable = [
        'incentive_status_name',
     ];
     
}
 
