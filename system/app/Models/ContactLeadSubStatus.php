<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadSubStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_sub_statuses';
    protected $fillable = [
        'contact_sub_status_name',
        'contact_status_id',
       
    ];
    public function contact_status_id_fun()
    {
        return $this->belongsTo(ContactLeadStatus::class,'contact_status_id');
    }
}
