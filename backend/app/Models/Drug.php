<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drug extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'substance', 'substance_en', 'ATC', 'strength', 'form', 'package', 'package_description', 'user_id',
    ];
    public function diseases()
    {
        return $this->belongsToMany(Disease::class);
    }
}
