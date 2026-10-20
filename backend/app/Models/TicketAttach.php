<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ticket_attaches';
    protected $fillable = [
        'ticket_attach',
        'ticket_id',
        'attach_name'
     ];
     public function ticket_id_fun()
     {
         return $this->belongsTo(Ticket::class,'ticket_id');
     }
}
