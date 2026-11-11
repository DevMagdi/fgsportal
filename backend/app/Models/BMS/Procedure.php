<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class Procedure extends Model
{
    protected $table='bms_procedures';
    protected $guarded=[];
    protected $casts=['is_published'=>'boolean'];
    public function creator(){return $this->belongsTo(\App\Models\User::class,'created_by');}
}
