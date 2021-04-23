<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Overview extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'description', 'diagnosis', 'prevention', 'user_id', 'disease_id',
    ];

    public function treatments(){
        return $this->hasMany(Treatment::class,'overview_id', 'id');
    }
    public function leaflets()
    {
        return $this->belongsToMany(Leaflet::class, 'overview_leaflet', 'overview_id', 'leaflet_id');
    }
    public function symptoms()
    {
        return $this->belongsToMany(Symptom::class);
    }
    public function disease()
    {
        return $this->belongsTo(Disease::class);
    }
    public function drugs()
    {
        return $this->belongsToMany(Drug::class, 'overviews_drugs', 'overview_id', 'drug_id')->withPivot('uses');
    }
}
