<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LicenseStatus extends Model
{ 
    use HasFactory,SoftDeletes;
    protected $table = 'license_statuses';
    protected $fillable = [
        'license_status_name',
     ];
}
