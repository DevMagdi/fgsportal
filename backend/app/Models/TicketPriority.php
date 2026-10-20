<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketPriority extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ticket_priorities';
 
    protected $fillable = [
        'ticket_priority',
        'ticket_time',
        'ticket_response_time',
        'ticket_solve_time',
        
    ];
    
}
