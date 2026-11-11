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
    protected $appends = ['overall_progress'];

    /** Share of completed phases (P1-2). Null until the phases relation is loaded. */
    public function getOverallProgressAttribute(): ?int
    {
        if (!$this->relationLoaded('phases')) {
            return null;
        }
        $total = $this->phases->count();
        if ($total === 0) {
            return 0;
        }
        return (int) round($this->phases->where('status', 'completed')->count() / $total * 100);
    }

    public function businessUnits()
    {
        return $this->belongsToMany(\App\Models\BMS\BusinessUnit::class, 'product_business_unit')->withTimestamps();
    }

    public function phases()
    {
        return $this->hasMany(\App\Models\BMS\ProductPhase::class)->orderBy('sequence');
    }

    public function minutes()
    {
        return $this->hasMany(\App\Models\BMS\Minutes::class,'linked_id')->where('linked_type','product')->with('meeting');
    }

    public function currentPhase()
    {
        return $this->hasOne(\App\Models\BMS\ProductPhase::class)
            ->whereIn('status', ['in_progress', 'blocked'])->orderBy('sequence');
    }
}
