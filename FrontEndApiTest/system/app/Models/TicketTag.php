<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketTag extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ticket_tags';
 
    protected $fillable = [
        'ticket_tag_name',
        'partner_id',
        'user_creator'
    ];
    public function partner_id_fun()
     {
         return $this->belongsTo(Partner::class,'partner_id');
     }
     
     public function user_creator_fun()
     {
         return $this->belongsTo(ClientAccount::class,'user_creator');
     }
    
}
