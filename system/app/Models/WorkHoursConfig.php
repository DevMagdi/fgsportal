<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkHoursConfig extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'work_hours_configs';

    
    protected $fillable = [
        'title',
        'start_date',
        'end_date',
        'config_duration',
        'user_creator_id',
          
    ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
}
 