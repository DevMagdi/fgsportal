<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contract_types';
 
    protected $fillable = [
        'contract_type',
        'contract_type_hours',
        'contract_type_day',
    
    ];
    

  
}
