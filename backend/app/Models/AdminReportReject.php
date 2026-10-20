<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminReportReject extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'admin_report_rejects';
        
   
    protected $fillable = [
        'report_id',
        'manager_reject_id',
        'reject_reason',
        'reject_date',
       
        
     ];

     public function report_id_fun()
    {
        return $this->belongsTo(AdminReport::class,'report_id');
    }
    public function manager_reject_id_fun()
    {
        return $this->belongsTo(User::class,'manager_reject_id');
    }
  

  
}
