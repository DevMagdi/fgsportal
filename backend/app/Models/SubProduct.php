<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubProduct extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'sub_products';
    
    protected $fillable = [
        'sub_product_name',
        'products_id',
    ];
    
    public function products_id_fun()
    {
        return $this->belongsTo(Product::class,'products_id');
    }
    
}
