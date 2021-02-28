<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Disease as DiseaseResource;

class Drug extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'substance' => $this->substance,
            'substance_en' => $this->substance_en,
            'atc' => $this->ATC,
            'package' => $this->package,
            'strength' => $this->strength,
            'form' => $this->form,
            'package_description' => $this->package_description,
            'updated_at' => $this->updated_at,
        ];
    }
}
