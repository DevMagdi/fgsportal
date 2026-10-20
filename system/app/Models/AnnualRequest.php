<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnualRequest extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'annual_requests';
    protected $fillable = [
        'reason',
        'from',
        'to',
        'annual_type_id',
        'annual_status_id',
        'manager_approve_id',
        'user_id',
        'updated_at',
        'created_at'
         
    ];
    public function annual_type_id_fun()
    {
        return $this->belongsTo(AnnualType::class,'annual_type_id');
    }
    public function annual_status_id_fun()
    {
        return $this->belongsTo(AnnualStatus::class,'annual_status_id');
    }
    public function manager_approve_id_fun()
    {
        return $this->belongsTo(User::class,'manager_approve_id');
    }
    public function user_id_fun()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
 