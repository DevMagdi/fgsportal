<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalaryReport extends Model
{
    use HasFactory;
    protected $fillable = [
        'unpaidVacations',
        'officalVacations',
        'idleHoursCost',
        'actualWorkingCost',
        'monthWorkingHours',
        'totalByHours',
        'totalInEGP',
        'user_creator_id',
        'user_to_id',
        'salary_status_id',
        'manager_approve_id',
        'last_user_action_id',
        'salary_report_date',
        'created_at',
        'updated_at'
    ];
    public function user_to_id_fun()
    {
        return $this->belongsTo(User::class,'user_to_id');
    }
    public function salary_status_id_fun()
    {
        return $this->belongsTo(SalaryReportStatus::class,'salary_status_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function last_user_action_id_fun()
    {
        return $this->belongsTo(User::class,'last_user_action_id');
    }
}
