<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkDegree extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'work_degrees';

    
    protected $fillable = [
        'work_degree_name',
          
    ];
    
}
