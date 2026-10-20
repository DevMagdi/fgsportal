<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectCostManual extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'project_cost_manuals';
    protected $fillable = [
        'cost_amount',
        'process_id',
        'cost_type_id',
        'user_creator_id',
        'comment',
        'project_cost_date',
        'user_id',
     ];
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
     public function user_id_fun()
     {
         return $this->belongsTo(User::class,'user_id');
     }
     public function process_id_fun()
     {
         return $this->belongsTo(Process::class,'process_id');
     }
     public function cost_type_id_fun()
     {
         return $this->belongsTo(CostType::class,'cost_type_id');
     }
   
 }