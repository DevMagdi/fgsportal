<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'tickets';
    protected $fillable = [
        'title',
        'ticket_type_id',
        'ticket_priority_id',
        'contract_support_id',
        'contact_account_id',
        'user_creator_id',
        'project_manager_id',
        'developer_id',
        'ticket_status_id',
        'notes',
        'escalated',
        'lastEscalat',
        'created_at',
        'updated_at',
        'firebasekey',
        'ticket_number',
        'ticket_tag_id'


     ];
     public function ticket_type_id_fun()
     {
         return $this->belongsTo(TicketType::class,'ticket_type_id');
     }
     public function ticket_priority_id_fun()
     {
         return $this->belongsTo(TicketPriority::class,'ticket_priority_id');
     }
     public function contract_support_id_fun()
     {
         return $this->belongsTo(ContractSupport::class,'contract_support_id');
     }
     public function contact_account_id_fun()
     {
         return $this->belongsTo(ClientAccount::class,'contact_account_id');
     }
     public function user_creator_id_fun()
     {
         return $this->belongsTo(User::class,'user_creator_id');
     }
     public function project_manager_id_fun()
     {
         return $this->belongsTo(User::class,'project_manager_id');
     }
     public function developer_id_fun()
     {
         return $this->belongsTo(User::class,'developer_id');
     }
     public function ticket_status_id_fun()
     {
         return $this->belongsTo(TicketStatus::class,'ticket_status_id');
     }
     public function ticket_tag_id_fun()
     {
         return $this->belongsTo(TicketTag::class,'ticket_tag_id');
     }
}
 

 