<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagram extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'user_id',
    ];
    public function nodes(){
        return $this->hasMany(Node::class);
    }
    public function edges(){
        return $this->hasMany(Edge::class);
    }
}
