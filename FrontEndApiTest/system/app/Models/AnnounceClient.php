<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnounceClient extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'announce_clients';
    protected $fillable = [
        'contact_account_id',
        'announce_id',
        'seen',
       
         
    ];
    
    public function contact_account_id_fun()
    {
        return $this->belongsTo(ClientAccount::class,'contact_account_id');
    }
  
    public function announce_id_fun()
    {
        return $this->belongsTo(Announce::class,'announce_id');
    }
}
 