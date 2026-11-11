<?php
namespace App\Models\BMS;

use Illuminate\Database\Eloquent\Model;

class SocialMetric extends Model
{
    protected $table='bms_social_metrics';
    protected $guarded=[];
    public function creator(){return $this->belongsTo(\App\Models\User::class,'created_by');}
}
