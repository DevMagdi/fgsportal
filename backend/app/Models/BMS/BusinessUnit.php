<?php
namespace App\Models\BMS;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class BusinessUnit extends Model {
    use SoftDeletes;
    protected $fillable = ['parent_id','name','slug','description','services','key_messages','director_id','is_active'];
    protected $casts = ['services'=>'array','is_active'=>'boolean'];
    public function parent(){ return $this->belongsTo(self::class,'parent_id'); }
    public function children(){ return $this->hasMany(self::class,'parent_id'); }
    public function director(){ return $this->belongsTo(User::class,'director_id'); }
    public function users(){ return $this->belongsToMany(User::class)->withTimestamps(); }
    public function weeklyPlans(){ return $this->hasMany(WeeklyPlan::class); }
    public function minutes(){ return $this->hasMany(Minutes::class,'linked_id')->where('linked_type','unit')->with('meeting'); }
}
