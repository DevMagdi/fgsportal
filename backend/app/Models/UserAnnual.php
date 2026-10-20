<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAnnual extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'user_annuals';
 
    protected $fillable = [
        'pending_balance',
        'monthly_balance_spend',
        'discount_from_pending',
        'total_leave_balance',
        'user_creator_id',
        'user_id',
        'available_leave_balance',
    ];
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function user_id_fun()
    {
        return $this->belongsTo(User::class,'user_id');
    }
 }
 