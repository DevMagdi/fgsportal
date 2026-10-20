<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractSupportHistory extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contract_support_histories';
    
    protected $fillable = [
        'contract_status_id_old',
        'contract_type_id_old',
        'user_creator_id',
        'contract_support_id',
        'contract_end_date_old',
        'contract_start_date_old'
    ];

    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function contract_support_id_fun()
    {
        return $this->belongsTo(ContractSupport::class,'contract_support_id');
    }
    public function contract_status_id_old_fun()
    {
        return $this->belongsTo(ContractStatus::class,'contract_status_id_old');
    }
    public function contract_type_id_old_fun()
    {
        return $this->belongsTo(ContractType::class,'contract_type_id_old');
    }  
}
