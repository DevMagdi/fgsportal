<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class License extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'licenses';
  
    protected $fillable = [
        'license_comment',
        'user_creator_id',
        'license_type_id',
        'license_status_id',
        'partner_id',
        'product_id',
        'license_start_date',
        'license_end_date',
         'license_number','created_at','firebasekey'
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function license_type_id_fun()
    {
        return $this->belongsTo(LicenseType::class,'license_type_id');
    }
    public function product_id_fun()
    {
        return $this->belongsTo(Product::class,'product_id');
    }
    public function license_status_id_fun()
    {
        return $this->belongsTo(LicenseStatus::class,'license_status_id');
    }
    public function partner_id_fun()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }
}
