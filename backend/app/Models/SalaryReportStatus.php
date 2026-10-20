<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalaryReportStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'salary_report_statuses';
    protected $fillable = [
        'salary_status_name',
     ];
}
