<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Substance extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'name_en', 'ATC',
    ];
    public function drugs()
    {
        return $this->hasMany(Drug::class);
    }
}
