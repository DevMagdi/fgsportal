<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PartnerIndustry extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'partner_industries';
    protected $fillable = [
        'partner_industry_name',
     ];
    
}
