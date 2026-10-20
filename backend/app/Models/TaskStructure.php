<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaskStructure extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'task_structures';
    protected $fillable = [
        'task_structure_name',
     ];
}
 