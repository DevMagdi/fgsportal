<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubDepartment extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'sub_departments';
    
    protected $fillable = [
        'sub_department_name',
        'departments_id',
    ];
    
    public function departments_id_fun()
    {
        return $this->belongsTo(Department::class,'departments_id');
    }
  
}
