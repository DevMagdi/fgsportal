<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_statuses';
    protected $fillable = [
        'contact_status_name',
       
    ];
 
}
