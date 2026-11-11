<?php
namespace App\Models\BMS;
use App\Models\ContactLead;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Opportunity extends Model {
    use SoftDeletes;
    protected $table='bms_opportunities';
    protected $attributes=['currency'=>'SAR','go_no_go'=>'pending'];
    protected $fillable=['reference','title','client_name','type','business_unit_id','contact_lead_id','product_id','owner_id','created_by','stage','value','currency','submission_date','expected_close_date','last_update_at','go_no_go','decision_reason','decided_by','decided_at','bms_lead_id','sector','notes','contact_name','contact_email','contact_phone'];
    protected $casts=['submission_date'=>'date','expected_close_date'=>'date','last_update_at'=>'datetime','decided_at'=>'datetime','value'=>'decimal:2'];
    public function unit(){ return $this->belongsTo(BusinessUnit::class,'business_unit_id'); }
    public function lead(){ return $this->belongsTo(ContactLead::class,'contact_lead_id'); }
    public function sourceLead(){ return $this->belongsTo(Lead::class,'bms_lead_id'); }
    public function product(){ return $this->belongsTo(Product::class); }
    public function owner(){ return $this->belongsTo(User::class,'owner_id'); }
    public function creator(){ return $this->belongsTo(User::class,'created_by'); }
    public function decisionMaker(){ return $this->belongsTo(User::class,'decided_by'); }
    public function history(){ return $this->hasMany(OpportunityStageHistory::class,'bms_opportunity_id')->latest(); }
    public function documents(){ return $this->hasMany(OpportunityDocument::class,'bms_opportunity_id')->latest(); }
    public function minutes(){ return $this->hasMany(Minutes::class,'linked_id')->where('linked_type','opportunity')->with('meeting'); }
    public function scopeFilter($query,$filters){
        return $query->when($filters['business_unit_id']??null,fn($q,$v)=>$q->where('business_unit_id',$v))
            ->when($filters['product_id']??null,fn($q,$v)=>$q->where('product_id',$v))
            ->when($filters['opportunity_id']??($filters['id']??null),fn($q,$v)=>$q->where('id',$v));
    }
}
