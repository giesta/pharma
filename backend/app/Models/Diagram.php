<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagram extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'user_id', 'updated_at'
    ];
    public function nodes(){
        return $this->hasMany(Node::class);
    }
    public function edges(){
        return $this->hasMany(Edge::class);
    }
    public function treatments(){
        return $this->hasMany(Treatment::class);
    }
    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
