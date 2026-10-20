<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements JWTSubject
{
     use HasApiTokens, HasFactory, Notifiable,SoftDeletes;
    protected $table = 'users';
   
     
    protected $fillable = [
        'username',
        'firstname',
        'lastname',
        'email',
        'password',
        'photoURL',
        'user_creator_id',
        'gender',
        'mobileNumber',
        'active',
        'user_details_id',
        'work_degrees_id',
        'refreshRequired',
        'token',
           'firebasekey',
        'branches_id',
        'sub_departments_id',
        'canAddPreviousReports',
        'canAddPreviousReportsDate',
        'open_to_work'
        
    ];

    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    public function sub_departments_id_fun()
    {
        return $this->belongsTo(SubDepartment::class,'sub_departments_id');
    }
    
    
    public function user_details_id_fun()
    {
        return $this->belongsTo(UserDetail::class,'user_details_id');
    }
    public function work_degrees_id_fun()
    {
        return $this->belongsTo(WorkDegree::class,'work_degrees_id');
    }
    public function branches_id_fun()
    {
        return $this->belongsTo(Branch::class,'branches_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
     ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    
    
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier() {
        return $this->getKey();
    }
    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims() {
        return [];
    }    
}
