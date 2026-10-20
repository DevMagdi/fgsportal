<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadCost extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_costs';
    protected $fillable = [
        'lead_cost_type_id',
        'contact_lead_id',
        'cost'
    ];

    public function lead_cost_type_id_fun()
    {
        return $this->belongsTo(ContactLeadCostType::class,'lead_cost_type_id');
    }
    
    public function contact_lead_id_fun()
    {
        return $this->belongsTo(ContactLead::class,'contact_lead_id');
    }
 
}

