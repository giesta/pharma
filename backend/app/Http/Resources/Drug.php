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
            'indication' => $this->indication,
            'contraindication' => $this->contraindication,
            'reaction' => $this->reaction,
            'use' => $this->use,
            'diseases' => DiseaseResource::collection($this->whenLoaded('diseases')),
        ];
    }
}
