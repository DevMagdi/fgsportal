<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends Model
{   
    use HasFactory,SoftDeletes;
    protected $table = 'partners';
    protected $fillable = [
        'partner_name',
        'partner_address',
        'partner_description',
        'partner_photoURL',
           'firebasekey',
        'user_creator_id',
        'partner_industry_id',
        'is_org',
        'phone',
        'email',
        'website',
        'country',
        'organize_type_id',
        'sales_id'
      ];
      public function organize_type_id_fun()
      {
          return $this->belongsTo(OrganizationType::class,'organize_type_id');
      }
      public function user_creator_id_fun()
      {
          return $this->belongsTo(User::class,'user_creator_id');
      }
      public function partner_industry_id_fun()
      {
          return $this->belongsTo(PartnerIndustry::class,'partner_industry_id');
      }
      
      public function sales_id_fun()
      {
          return $this->belongsTo(User::class,'sales_id');
      }




      
}
