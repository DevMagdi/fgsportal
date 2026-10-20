<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ManagerTicketUpdate extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'manager_ticket_updates';
    protected $fillable = [
         'ticket_type_id',
        'ticket_priority_id',
         'ticket_id',
        'user_creator_id',
        'project_manager_id',
        'developer_id',
        'ticket_status_id',
        'notes','created_at'
     ];
     public function ticket_type_id_fun()
     {
         return $this->belongsTo(TicketType::class,'ticket_type_id');
     }
     public function ticket_priority_id_fun()
     {
         return $this->belongsTo(TicketPriority::class,'ticket_priority_id');
     }
     public function ticket_id_fun()
     {
         return $this->belongsTo(Ticket::class,'ticket_id');
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
}
 

 