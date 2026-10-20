<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadActivity extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_activities';
    protected $fillable = [
        'sales_id',
        'contact_lead_id',
        'lead_sub_status_id',
        'activity_type_id',
        'activity_status_id',
        'comment',
        'from_date',
        'to_date',
        'visibility',
         'activity_start_date',
            'activity_end_date',
            'duration',
            'description'
    ];
    public function sales_id_fun()
    {
        return $this->belongsTo(User::class,'sales_id');
    }
    public function contact_lead_id_fun()
    {
        return $this->belongsTo(ContactLead::class,'contact_lead_id');
    }
    public function lead_sub_status_id_fun()
    {
        return $this->belongsTo(ContactLeadSubStatus::class,'lead_sub_status_id');
    }
    public function activity_type_id_fun()
    {
        return $this->belongsTo(ActivityType::class,'activity_type_id');
    }
    public function activity_status_id_fun()
    {
        return $this->belongsTo(ActivityStatus::class,'activity_status_id');
    }
}
