<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OnboardingRequirement extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'onboarding_requirements';
    protected $fillable = [
        'onboarding_requirement_type',
     ];
}
 