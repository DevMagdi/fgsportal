<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FamilyInformation extends Model
{
    use HasFactory;
     
    protected $fillable = [
        'family_name',
        'relation',
        'gender',
        'birth_date',
        'user_id',
      
    ];
    public function user_id_fun()
    {
        return $this->belongsTo(User::class,'user_id');
    }
}
