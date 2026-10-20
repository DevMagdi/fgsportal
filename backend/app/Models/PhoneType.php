<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhoneType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'phone_types';
    protected $fillable = [
        'phone_type',
     ];
}
