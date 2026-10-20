<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyPolicy extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'company_policies';
    protected $fillable = [
        'policy'
     ];
}
 