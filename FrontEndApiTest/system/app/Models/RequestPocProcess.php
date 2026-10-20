<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestPocProcess extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'request_poc_processes';
    protected $fillable = [
        'process_title',
        'process_department',
        'process_description',
        'request_poc_id',
     ];
     public function request_poc_id_fun()
     {
         return $this->belongsTo(RequestPoc::class,'request_poc_id');
     }
}