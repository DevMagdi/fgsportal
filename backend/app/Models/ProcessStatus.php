<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcessStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'process_statuses';
    protected $fillable = [
        'process_status_name',
     ];
}
