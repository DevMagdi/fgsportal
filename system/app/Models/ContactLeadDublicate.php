<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactLeadDublicate extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'contact_lead_dublicates';
    protected $fillable = [
        'campagin_id',
        'contact_id',
        'branches_id',
        'user_creator_id',
        'notes',
        'partner_id',
    ];
    public function campagin_id_fun()
    {
        return $this->belongsTo(Campagin::class,'campagin_id');
    }
    
    public function contact_id_fun()
    {
        return $this->belongsTo(Contact::class,'contact_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function branches_id_fun()
    {
        return $this->belongsTo(Branch::class,'branches_id');
    }
    public function partner_id()
    {
        return $this->belongsTo(Partner::class,'parnter_id');
    }
 
}
