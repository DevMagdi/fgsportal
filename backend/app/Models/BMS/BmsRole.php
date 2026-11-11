<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class BmsRole extends Model {
    protected $fillable=['name','slug','abilities'];
    protected $casts=['abilities'=>'array'];
    public function users(){ return $this->belongsToMany(User::class,'bms_role_user')->withPivot('business_unit_id')->withTimestamps(); }
}
