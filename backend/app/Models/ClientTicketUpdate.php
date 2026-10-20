<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientTicketUpdate extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'client_ticket_updates';
    protected $fillable = [
        'title',
        'ticket_type_id',
        'ticket_priority_id',
         'contact_account_id',
         'ticket_id',
         'ticket_status_id',
        'attach_ticket_array',
        'notes',
     ];
     public function ticket_type_id_fun()
     {
         return $this->belongsTo(TicketType::class,'ticket_type_id');
     }
    
     public function ticket_status_id_fun()
     {
         return $this->belongsTo(TicketStatus::class,'ticket_status_id');
     }
     public function ticket_priority_id_fun()
     {
         return $this->belongsTo(TicketPriority::class,'ticket_priority_id');
     }
     public function ticket_id_fun()
     {
         return $this->belongsTo(Ticket::class,'ticket_id');
     }
     public function contact_account_id_fun()
     {
         return $this->belongsTo(ClientAccount::class,'contact_account_id');
     }
        protected $casts=[
            'attach_ticket_array'=>'array',
        ];
}  