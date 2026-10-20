<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ticket_statuses';
    protected $fillable = [
        'ticket_status_name',
     ];
}
 