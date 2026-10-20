<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GlobalStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'global_statuses';
    protected $fillable = [
        'hr_global_status',
     ];
}

 