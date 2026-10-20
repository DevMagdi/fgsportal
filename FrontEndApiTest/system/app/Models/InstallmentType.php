<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstallmentType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'installment_types';
    protected $fillable = [
        'installment_type_name',
        
    ];
     
     
 
}
