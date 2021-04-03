<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Treatment extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'description', 'algorithm', 'public', 'user_id', 'overview_id', 'uses'
    ];
    public function overview(){
        return $this->belongsTo(Overview::class,'overview_id', 'id');
    }
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function starsCount(){
        return $this->stars()->count();
    }
    public function reportsCount(){
        return $this->reports()->count();
    }
    public function star(User $user){
        $this->stars()->updateOrCreate([
            "user_id" =>$user->id
        ]);
    }
    public function report(User $user){
        $this->reports()->updateOrCreate([
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
    public function isReportedBy(User $user = null){
        if($user !== null){
            return (boolean)$user->reports->where('treatment_id', $this->id)->count();
        }
        else{
            return true;
        }        
    }
    public function stars(){
        return $this->hasMany(Star::class);
    }
    public function reports(){
        return $this->hasMany(Report::class);
    }
    public function comments(){
        return $this->hasMany(Comment::class);
    }
    public function drugs()
    {
        return $this->belongsToMany(Drug::class, 'treatments_drugs', 'treatment_id', 'drug_id');
    }
}
