<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campagin extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'campagins';
    protected $fillable = [
            'product_id',
            'ads_platform_id',
            'campagin_name',
            'campagin_title',
            'user_creator_id',
            'campagin_description',
            'campagin_cost',
            'branches_id',
            'start_date',
            'end_date',
            'campagin_status_id',
            'campagin_expected'
        ];
        public function product_id_fun()
        {
            return $this->belongsTo(Product::class,'product_id');
        }
        
        public function ads_platform_id_fun()
        {
            return $this->belongsTo(AdsPlatform::class,'ads_platform_id');
        }
        public function user_creator_id_fun()
        {
            return $this->belongsTo(User::class,'user_creator_id');
        }
        public function branches_id_fun()
        {
            return $this->belongsTo(Branch::class,'branches_id');
        }
        public function campagin_status_id_fun()
        {
            return $this->belongsTo(CampaginStatus::class,'campagin_status_id');
        }
     
    }
