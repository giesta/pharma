<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disease extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'treatment_id', 'user_id',
    ];

    public function treatments(){
        return $this->hasMany(Treatment::class,'treatment_id', 'id');
    }
    public function leaflets()
    {
        return $this->belongsToMany(Leaflet::class);
    }
    public function drugs()
    {
        return $this->belongsToMany(Drug::class);
    }
    public function symptoms()
    {
        return $this->belongsToMany(Symptom::class);
    }
}
