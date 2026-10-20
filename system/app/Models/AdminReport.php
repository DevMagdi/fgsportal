<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminReport extends Model
{

    use HasFactory,SoftDeletes;
    protected $table = 'admin_reports';
 
    protected $fillable = [
        'duration',
        'report_type_id',
        'report_status_id',
        'manager_approve_id',
        'user_creator_id',
        'report_details',
        'report_date',
        'report_progress',
        'task_id',
        'report_cost',
        
        
     ];

     public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
  
    public function report_type_id_fun()
    {
        return $this->belongsTo(ReportType::class,'report_type_id');
    }
  
    public function report_status_id_fun()
    {
        return $this->belongsTo(ReportStatus::class,'report_status_id');
    }
   
    public function task_id_fun()
    {
        return $this->belongsTo(AdminTask::class,'task_id');
    }
  
}
