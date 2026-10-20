<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportReject extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'report_rejects';
  
    protected $fillable = [
        'report_id',
        'manager_reject_id',
        'reject_reason',
        'reject_date',
         'created_at',
        'updated_at'
        
     ];

     public function report_id_fun()
    {
        return $this->belongsTo(Report::class,'report_id');
    }
    public function manager_reject_id_fun()
    {
        return $this->belongsTo(User::class,'manager_reject_id');
    }
 
}
