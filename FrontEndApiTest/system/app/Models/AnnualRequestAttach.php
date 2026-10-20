<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnualRequestAttach extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'annual_request_attaches';
    protected $fillable = [
        'attach_name',
        'annual_request_id',
         
         
    ];
    public function annual_request_id_fun()
    {
        return $this->belongsTo(AnnualRequest::class,'annual_request_id');
    }
 }
 