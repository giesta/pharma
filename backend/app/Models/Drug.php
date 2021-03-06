<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drug extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'substance', 'substance_en', 'ATC', 'strength', 'form', 'package', 'package_description', 'registration',
    ];
    public function substance()
    {
        return $this->belongsTo(Substance::class);
    }
    public function overviews()
    {
        return $this->belongsToMany(Overview::class, 'overviews_drugs', 'overview_id', 'drug_id')->withPivot('uses');
    }
    public function treatments()
    {
        return $this->belongsToMany(Treatment::class, 'treatments_drugs', 'treatment_id', 'drug_id')->withPivot('uses');
    }
}
