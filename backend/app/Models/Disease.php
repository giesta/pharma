<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disease extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'symptoms', 'treatment_id', 'user_id',
    ];

    public function treatments(){
        return $this->hasMany(Treatment::class,'treatment_id', 'id');
    }
    public function drugs()
    {
        return $this->belongsToMany(Drug::class);
    }
    public function symptoms()
    {
        return $this->belongsToMany(Role::class);
    }
}
