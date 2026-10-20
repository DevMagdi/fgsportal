<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClientViolence extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'client_violences';
  
    protected $fillable = [
        'client_violence_message',
        'client_id',
            
    ];
    public function client_id_fun()
    {
        return $this->belongsTo(ClientAccount::class,'client_id');
    }
   
}

