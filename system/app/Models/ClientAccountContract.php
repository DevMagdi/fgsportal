<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientAccountContract extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'client_account_contracts';
 
    protected $fillable = [
        'client_account_id',
        'contract_support_id',
         
    ];
    
    public function client_account_id_fun()
    {
        return $this->belongsTo(ClientAccount::class,'client_account_id');
    }

    public function contract_support_id_fun()
    {
        return $this->belongsTo(ContractSupport::class,'contract_support_id');
    }
    
}
 