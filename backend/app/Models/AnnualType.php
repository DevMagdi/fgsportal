<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnualType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'annual_types';
    protected $fillable = [
        'annual_type',
         
    ];
    
    
  
}
 