<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'products';
    protected $fillable = [
        'product_name',
     ];

    public function businessUnits()
    {
        return $this->belongsToMany(\App\Models\BMS\BusinessUnit::class, 'product_business_unit')->withTimestamps();
    }

    public function phases()
    {
        return $this->hasMany(\App\Models\BMS\ProductPhase::class)->orderBy('sequence');
    }

    public function currentPhase()
    {
        return $this->hasOne(\App\Models\BMS\ProductPhase::class)
            ->whereIn('status', ['in_progress', 'blocked'])->orderBy('sequence');
    }
}
