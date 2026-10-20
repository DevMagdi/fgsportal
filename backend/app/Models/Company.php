<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Tenant / client company. Module entitlements are attached per company.
 */
class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'company_id');
    }

    public function companyModules()
    {
        return $this->hasMany(CompanyModule::class, 'company_id');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'company_modules', 'company_id', 'module_id')
            ->withPivot(['is_enabled', 'enabled_at'])
            ->withTimestamps();
    }

    /**
     * Enabled modules for this company.
     */
    public function enabledModules()
    {
        return $this->modules()->where('company_modules.is_enabled', true);
    }
}
