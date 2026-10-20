<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LicenseHistory extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'license_histories';
   
    protected $fillable = [
  
        'user_creator_id',
        'license_type_id_old',
        'license_status_id_old',
         'license_start_date_old',
        'license_end_date_old',
        'license_id','created_at'
         
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function license_type_id_old_fun()
    {
        return $this->belongsTo(LicenseType::class,'license_type_id_old');
    }
    
    public function license_status_id_old_fun()
    {
        return $this->belongsTo(LicenseStatus::class,'license_status_id_old');
    }
    public function license_id_fun()
    {
        return $this->belongsTo(License::class,'license_id');
    }
}

