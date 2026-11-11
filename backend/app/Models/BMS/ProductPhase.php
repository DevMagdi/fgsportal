<?php
namespace App\Models\BMS;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
class ProductPhase extends Model {
    protected $fillable=['product_id','name','sequence','status','progress','blockers','data_needs','support_needs','start_date','end_date','updated_by'];
    protected $casts=['start_date'=>'date','end_date'=>'date','progress'=>'integer'];
    public function product(){ return $this->belongsTo(Product::class); }
    public function updater(){ return $this->belongsTo(User::class,'updated_by'); }
}
