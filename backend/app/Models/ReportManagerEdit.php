<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportManagerEdit extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'report_manager_edits';
    protected $fillable = [
        'report_id',
        'manager_edit_id',
        'old_duration',
        'comment',
         'created_at',
        'updated_at'
        
     ];
     public function report_id_fun()
    {
        return $this->belongsTo(Report::class,'report_id');
    }
    public function manager_edit_id_fun()
    {
        return $this->belongsTo(User::class,'manager_edit_id');
    }
 
}
