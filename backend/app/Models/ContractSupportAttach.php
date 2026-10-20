<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractSupportAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contract_support_attaches';
    
    protected $fillable = [
        'contract_attach',
        'contract_support_id',
        'user_creator_id',
        
    ];

    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function contract_support_id_fun()
    {
        return $this->belongsTo(ContractSupport::class,'contract_support_id');
    }

     
}

