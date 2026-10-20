<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Catalogue entry for a sellable system module (crm, ticketing, ...).
 */
class Module extends Model
{
    use HasFactory;

    protected $table = 'modules';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_core',
        'is_active',
    ];

    protected $casts = [
        'is_core' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function companyModules()
    {
        return $this->hasMany(CompanyModule::class, 'module_id');
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class, 'company_modules', 'module_id', 'company_id')
            ->withPivot(['is_enabled', 'enabled_at'])
            ->withTimestamps();
    }

    /**
     * @param  string  $slug
     */
    public static function findBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->first();
    }
}
