<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdsPlatform extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ads_platforms';
    protected $fillable = [
        'ads_platform_name',
       
    ];
 
}
 