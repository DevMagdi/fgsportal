<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AskForRate extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'ask_for_rates';
 
    protected $fillable = [
        'user_creator_id',
        'question_group_id',
        'status',
        'user_rate_id',
        'user_to_rate_id',
        'client_account_id',
        'task_id',
        'ticket_id'
     ];

     public function task_id_fun()
     {
         return $this->belongsTo(Task::class,'task_id');
     }
     public function ticket_id_fun()
     {
         return $this->belongsTo(Ticket::class,'ticket_id');
     }

     public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function user_to_rate_id_fun()
    {
        return $this->belongsTo(User::class,'user_to_rate_id');
    }
    public function user_rate_id_fun()
    {
        return $this->belongsTo(User::class,'user_rate_id');
    }
    public function question_group_id_fun()
    {
        return $this->belongsTo(QuestionGroup::class,'question_group_id');
    }
    public function client_account_id_fun()
    {
        return $this->belongsTo(ClientAccount::class,'client_account_id');
    }
    
}
