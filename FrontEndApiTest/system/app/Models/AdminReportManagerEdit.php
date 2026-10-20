<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminReportManagerEdit extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'admin_report_manager_edits';
        
   
    protected $fillable = [
        'report_id',
        'manager_edit_id',
        'old_duration',
        'comment',
       
        
     ];

     public function report_id_fun()
    {
        return $this->belongsTo(AdminReport::class,'report_id');
    }
    public function manager_edit_id_fun()
    {
        return $this->belongsTo(User::class,'manager_edit_id');
    }
  

  
}
