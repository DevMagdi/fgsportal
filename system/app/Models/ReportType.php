<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'report_types';
    protected $fillable = [
        'report_type',
     ];
}
