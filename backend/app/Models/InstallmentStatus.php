<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstallmentStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'installment_statuses';
    protected $fillable = [
        'installment_status_name',
        
    ];
     
     
 
   
}
 