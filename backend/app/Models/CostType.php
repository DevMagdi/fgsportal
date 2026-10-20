<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CostType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'cost_types';
    protected $fillable = [
        'cost_type',
    ];
  
}
 