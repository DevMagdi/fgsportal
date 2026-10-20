<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabelColor extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'label_colors';
    protected $fillable = [
        'label_name',
        'label_color',
       
    ];
 
}
