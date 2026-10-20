<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeveloperTicketAction extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'developer_ticket_actions';
    protected $fillable = [
         'ticket_id',
        'user_creator_id',
         'ticket_status_id',
         'title',
         'comment',
         'visibility',
         'contact_account_id','created_at'
        ];
    
    
     public function ticket_id_fun()
     {
         return $this->belongsTo(Ticket::class,'ticket_id');
     }
     public function contact_account_id_fun()
     {
         return $this->belongsTo(ClientAccount::class,'contact_account_id');
     }
 
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
 
     public function ticket_status_id_fun()
     {
         return $this->belongsTo(TicketStatus::class,'ticket_status_id');
     }
}
 
 