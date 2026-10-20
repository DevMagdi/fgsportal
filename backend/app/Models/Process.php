<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Process extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'processes';

    protected $fillable = [
        'process_title',
        'process_progress',
        'process_description',
        'process_duration',
        'user_creator_id',
        'process_status_id',
        'project_id',
        'process_start_date',
        'process_end_date',
        'firebasekey','created_at'
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
   
    public function process_status_id_fun()
    {
        return $this->belongsTo(ProcessStatus::class,'process_status_id');
    }
    public function project_id_fun()
    {
        return $this->belongsTo(Project::class,'project_id');
    }
}

