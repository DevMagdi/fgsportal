<?php
namespace App\Models\BMS;
use Illuminate\Database\Eloquent\Model;
class PipelineStage extends Model
{
    protected $table='bms_pipeline_stages';protected $guarded=[];protected $casts=['is_active'=>'boolean'];
}
