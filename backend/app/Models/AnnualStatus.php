<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnualStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'annual_statuses';
    protected $fillable = [
        'annual_status_name',
         
    ];
    
    
}
 