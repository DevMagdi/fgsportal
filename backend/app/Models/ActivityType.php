<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActivityType extends Model
{

use HasFactory,SoftDeletes;
protected $table = 'activity_types';
protected $fillable = [
    'activity_type_name',
];

} 