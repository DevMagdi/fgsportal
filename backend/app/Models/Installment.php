<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Installment extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'installments';
    protected $fillable = [
        'title',
        'payment_bank',
        'main_description',
        'installment_status_id',
        'user_creator_id',
        'installment_type_id',
        'total_amount',
        'remaining',
        'interest_amount',
        'currency',
        'down_payment_amount'
    ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function installment_status_id_fun()
    {
        return $this->belongsTo(InstallmentStatus::class,'installment_status_id');
    }
    public function installment_type_id_fun()
    {
        return $this->belongsTo(InstallmentType::class,'installment_type_id');
    }
 
   

}
 