<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'task_statuses';
    protected $fillable = [
        'task_status_name',
     ];
}
 