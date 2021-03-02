<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Leaflet as LeafletResource;

class Overview extends JsonResource
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
            'name' => $this->disease->name,
            'disease_id' => $this->disease->id,
            'description' => $this->description,
            'diagnosis' => $this->diagnosis,
            'prevention' => $this->prevention,
            'symptoms' => $this->symptoms,
            'drugs' => LeafletResource::collection($this->whenLoaded('leaflets')),
        ];
    }
}