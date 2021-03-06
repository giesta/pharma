<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Disease as DiseaseResource;
use App\Http\Resources\Substance as SubstanceResource;

class DrugWithUses extends JsonResource
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
            'substance' => $this->substance()->with('drugs')->find($this->substance->id),
            'ATC' => $this->ATC,
            'package' => $this->package,
            'strength' => $this->strength,
            'form' => $this->form,
            'package' => $this->package,
            'package_description' => $this->package_description,
            'registration' => $this->registration,
            'link' => $this->link,
            'uses' => $this->pivot->uses,
            'updated_at' => $this->updated_at,
        ];
    }
}
