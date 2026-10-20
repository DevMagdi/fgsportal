<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'branches';
    protected $fillable = [
        'branch_name',
        'branch_details_id',
        
    ];
    
    public function branch_details_id_fun()
    {
        return $this->belongsTo(BranchDetails::class,'branch_details_id');
    }
  
}
