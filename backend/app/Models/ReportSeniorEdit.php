<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportSeniorEdit extends Model
{
    use HasFactory,SoftDeletes;
  
    protected $table = 'report_senior_edits';
    protected $fillable = [
        'report_id',
        'senior_edit_id',
        'comment',
         'created_at',
        'updated_at'
     ];
     public function report_id_fun()
    {
        return $this->belongsTo(Report::class,'report_id');
    }
    public function senior_edit_id_fun()
    {
        return $this->belongsTo(User::class,'senior_edit_id');
    }
 
}
