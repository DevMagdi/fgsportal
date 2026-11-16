<?php

namespace App\Models\BMS;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bonus extends Model
{
    use SoftDeletes;

    protected $table = 'bms_bonuses';
    protected $fillable = ['employee_id', 'business_unit_id', 'title', 'amount', 'currency', 'awarded_on', 'status', 'notes'];
    protected $casts = ['amount' => 'float', 'awarded_on' => 'date:Y-m-d'];

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function unit()
    {
        return $this->belongsTo(BusinessUnit::class, 'business_unit_id');
    }
}
