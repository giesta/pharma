<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Treatment extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'description', 'algorithm', 'public', 'user_id', 'disease_id'
    ];
    public function disease(){
        return $this->belongsTo(Disease::class,'disease_id', 'id');
    }
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function starsCount(){
        return $this->stars()->count();
    }
    public function star(User $user){
        $this->stars()->updateOrCreate([
            "user_id" =>$user->id
        ]);
    }
    public function isStarBy(User $user = null){
        if($user !== null){
            return (boolean)$user->stars->where('treatment_id', $this->id)->count();
        }
        else{
            return true;
        }        
    }
    public function stars(){
        return $this->hasMany(Star::class);
    }
    public function comments(){
        return $this->hasMany(Comment::class);
    }
}
