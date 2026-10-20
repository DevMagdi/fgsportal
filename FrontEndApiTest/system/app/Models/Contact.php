<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contacts';
    protected $fillable = [
        'user_creator_id',
        'partner_id',
        'name',
        'notes',
        'email',
        'phone',
        'address',
        'title'
     ];
   
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
  
     public function partner_id_fun()
     {
         return $this->belongsTo(Partner::class,'partner_id');
     }
    protected $casts=[
        'phone'=>'array',
    ];

}
