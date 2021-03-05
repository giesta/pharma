<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Leaflet as LeafletResource;

class DiseaseDrugs extends JsonResource
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
            'drugs' => LeafletResource::collection($this->whenLoaded('leaflets')),
        ];
    }
}
