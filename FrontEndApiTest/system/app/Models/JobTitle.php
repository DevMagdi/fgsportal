<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobTitle extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'job_titles';
    protected $fillable = [
        'hr_job_title',
        'description',
        'job_status',
        'job_skills_id'
        
     ];


     protected $casts=[
        'job_skills_id'=>'array',
    ];
}

 