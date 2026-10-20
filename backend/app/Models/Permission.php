<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'permissions';
    protected $fillable = [
        'permission_name',
        'description',
        'permission_group_id'
     ];

     public function permission_group_id_fun()
     {
         return $this->belongsTo(PermissionGroup::class,'permission_group_id');
     }
}
