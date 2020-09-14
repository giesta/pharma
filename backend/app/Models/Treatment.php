<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treatment extends Model
{
    use HasFactory;
    protected $fillable = [
        'title', 'description', 'algorithm', 'user_id', 'disease_id'
    ];
    public function disease(){
        return $this->belongsTo(Disease::class,'disease_id', 'id');
    }
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
