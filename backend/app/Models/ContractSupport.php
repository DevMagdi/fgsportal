<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractSupport extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contract_supports';
 
    protected $fillable = [
        'notes',
        'user_creator_id',
        'project_manager_id',
        'manager_id',
        'contract_type_id',
        'partner_id',
        'product_id',
        'contract_status_id',
        'contract_end_date',
        'contract_start_date',
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }

    public function project_manager_id_fun()
    {
        return $this->belongsTo(User::class,'project_manager_id');
    }
    public function manager_id_fun()
    {
        return $this->belongsTo(User::class,'manager_id');
    }

    public function contract_type_id_fun()
    {
        return $this->belongsTo(ContractType::class,'contract_type_id');
    }
    public function partner_id_fun()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }
    
    public function product_id_fun()
    {
        return $this->belongsTo(Product::class,'product_id');
    }
    public function contract_status_id_fun()
    {
        return $this->belongsTo(ContractStatus::class,'contract_status_id');
    }
}

