<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttachmentStatus extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'attachment_statuses';
    protected $fillable = [
        'hr_attachment_status',
     ];
}

 