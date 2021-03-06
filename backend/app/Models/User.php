<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Http\Resources\User as UserResource;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    
    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ['user'=>new UserResource($this)];
    }

    public function treatments(){
        return $this->hasMany(Treatment::class);
    }
    public function diseases(){
        return $this->hasMany(Disease::class);
    }
    public function overviews(){
        return $this->hasMany(Overview::class);
    }
    public function drugs(){
        return $this->hasMany(Drug::class);
    }
    public function leaflets(){
        return $this->hasMany(Leaflet::class);
    }
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function stars(){
        return $this->hasMany(Star::class);
    }

    public function reports(){
        return $this->hasMany(Report::class);
    }

    public function diagrams(){
        return $this->hasMany(Diagram::class);
    }
}
