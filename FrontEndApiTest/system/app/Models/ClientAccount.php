<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
 use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

 class ClientAccount extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable,SoftDeletes;
    protected $table = 'client_accounts';
    protected $fillable = [
        'fullname',
        'email',
        'password',
        'phone',
        'token',
        'refreshRequired',
        'active',
        'primary',
        'partner_id',
        'user_creator_id',
        'firebasekey',
        'client_account_id'
     ];
     protected $hidden = [
        'password',
     ];
    public function partner_id_fun()
    {
        return $this->belongsTo(Partner::class,'partner_id');
    }
    public function client_account_id_fun()
    {
        return $this->belongsTo(ClientAccount::class,'client_account_id');
    }
    public function user_creator_id_fun()
    {
        return $this->belongsTo(User::class,'user_creator_id');
    }
    
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
