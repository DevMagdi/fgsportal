<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecruitmentEmailType extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'recruitment_email_types';
    protected $fillable = [
        'email_type',
     ];
}
 