<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstallmentPeriod extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'installment_periods';
    protected $fillable = [
        'installment_id',
        'is_paid',
        'installment_amount',
        'incoming_date',
        'user_creator_id',
        'installment_description',
        'notified',
        'rowIndex'
        
    ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function installment_id_fun()
    {
        return $this->belongsTo(Installment::class,'installment_id');
    }
     
 
   
}
 