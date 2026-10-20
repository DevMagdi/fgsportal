<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BranchDetail extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'branch_details';
     
    protected $fillable = [
        'branch_description',
        'branch_lat',
        'branch_lng',
        'branch_address',
        'branch_email',
        'branch_phone',
        'branch_mobile',
         
    ];
    
}
