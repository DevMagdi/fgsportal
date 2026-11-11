<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class BmsAuditLog extends Model {
    protected $fillable=['auditable_type','auditable_id','event','old_values','new_values','reason','user_id'];
    protected $casts=['old_values'=>'array','new_values'=>'array'];
    public function auditable(){ return $this->morphTo(); }
    public function user(){ return $this->belongsTo(User::class); }
}
