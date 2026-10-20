<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeveloperDivision extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'developer_divisions';
    
    protected $fillable = [
        'sub_products_id',
        'users_id',
    ];
    
    public function sub_products_id_fun()
    {
        return $this->belongsTo(SubProduct::class,'sub_products_id');
    }
    public function users_id_fun()
    {
        return $this->belongsTo(User::class,'users_id');
    }
}
