<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestPocAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_poc_attaches';
    protected $fillable = [
        'request_poc_id',
        'request_poc_attach',
     ];
     
    public function request_poc_id_fun()
    {
        return $this->belongsTo(RequestPoc::class,'request_poc_id');
    }
   
}

 