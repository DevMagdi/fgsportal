<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestPocActionAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_poc_action_attaches';
    protected $fillable = [
        'request_poc_action_id',
        'request_poc_attach',
     ];
     
    public function request_poc_action_id_fun()
    {
        return $this->belongsTo(RequestPocAction::class,'request_poc_action_id');
    }
   
}
