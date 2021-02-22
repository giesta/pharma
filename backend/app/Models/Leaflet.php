<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Leaflet extends Model
{
    use HasFactory;
    protected $fillable = [
        'indication', 'contraindication', 'reaction', 'use','user_id', 'drug_id', 'link',
    ];
    public function diseases()
    {
        return $this->belongsToMany(Disease::class);
    }
    public function drug()
    {
        return $this->belongsTo(Drug::class);
    }
}
