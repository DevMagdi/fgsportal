<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Pivot entity recording whether a module is enabled for a company.
 */
class CompanyModule extends Model
{
    use HasFactory;

    protected $table = 'company_modules';

    protected $fillable = [
        'company_id',
        'module_id',
        'is_enabled',
        'enabled_at',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'enabled_at' => 'datetime',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}
