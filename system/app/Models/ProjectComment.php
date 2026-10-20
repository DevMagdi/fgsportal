<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectComment extends Model
{
    use HasFactory,SoftDeletes;
    protected $table = 'project_comments';
 
    protected $fillable = [
        'project_comment',
        'user_creator_id',
        'project_id',
    ];
    
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
   
    public function project_id_fun()
    {
        return $this->belongsTo(Projects::class,'project_id');
    }
   
}
