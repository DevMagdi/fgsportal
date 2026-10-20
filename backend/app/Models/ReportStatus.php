<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'report_statuses';
    protected $fillable = [
        'report_status_name',
     ];
}
