<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LicenseAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'license_attaches';
    
    protected $fillable = [
        'license_attach',
        'license_id',
        'user_creator_id',
        
    ];

    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function license_id_fun()
    {
        return $this->belongsTo(License::class,'license_id');
    }

     
}

