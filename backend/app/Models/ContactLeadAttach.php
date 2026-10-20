<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_attaches';
    protected $fillable = [
        'contact_lead_attach',
        'contact_lead_id',
        'user_creator_id',
      

     ];
     public function contact_lead_id_fun()
     {
         return $this->belongsTo(ContactLead::class,'contact_lead_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
   
}
