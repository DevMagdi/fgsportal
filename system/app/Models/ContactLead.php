<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLead extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_leads';
    protected $fillable = [
        'campagin_id',
        'sales_id',
        'user_creator_id',
        'lead_sub_status_id',
        'lead_type_id',
        'label',
        'product_id',
        'cost',
        'seen',
        'isLead',
        'transfer',
        'expected_close_date',
        'contact_id',
        'notes',
        'title',
        'currency',
        'actual_closing_date'

     ];
     public function contact_id_fun()
     {
         return $this->belongsTo(Contact::class,'contact_id');
     }
     public function campagin_id_fun()
     {
         return $this->belongsTo(Campagin::class,'campagin_id');
     }
     public function sales_id_fun()
     {
         return $this->belongsTo(User::class,'sales_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
     public function lead_sub_status_id_fun()
     {
         return $this->belongsTo(ContactLeadSubStatus::class,'lead_sub_status_id');
     }
     public function lead_type_id_fun()
     {
         return $this->belongsTo(ContactLeadType::class,'lead_type_id');
     }
     public function product_id_fun()
     {
         return $this->belongsTo(Product::class,'product_id');
     }
     public function partner_id_fun()
     {
         return $this->belongsTo(Partner::class,'partner_id');
     }
    protected $casts=[
        'label'=>'array',

    ];

   
}