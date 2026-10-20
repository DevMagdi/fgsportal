<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PermissionBalance extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'permission_balances';
    protected $fillable = [
        'monthly_balance',
        'bereavement',
        'marriage',
        'birth',
        'birth_f',
        
    ];     
    
 }
 