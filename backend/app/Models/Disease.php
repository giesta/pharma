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
        //return $this->belongsToMany(RelatedModel, pivot_table_name, foreign_key_of_current_model_in_pivot_table, foreign_key_of_other_model_in_pivot_table);
        return $this->belongsToMany(
            Drug::class,
            'diseases_drugs',
            'disease_id',
            'drug_id');
    }
}
