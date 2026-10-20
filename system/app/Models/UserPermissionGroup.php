<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserPermissionGroup extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_permission_groups';
     
    protected $fillable = [
        'permissions_id',
        'users_id',
    ];
    
    public function permissions_id_fun()
    {
        return $this->belongsTo(Permission::class,'permissions_id');
    }
    public function users_id_fun()
    {
        return $this->belongsTo(User::class,'users_id');
    }
}
