<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobSkill extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'job_skills';
    protected $fillable = [
        'job_skill',
     ];
}

 