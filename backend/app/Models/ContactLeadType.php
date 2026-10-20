<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_types';
    protected $fillable = [
        'lead_type_name',
       
    ];
 
}
