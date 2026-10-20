<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadCostType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_cost_types';
    protected $fillable = [
        'lead_cost_type',
        'type'
       
    ];
 
}


