<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Drug as DrugResource;

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
            'drugs' => DrugResource::collection($this->whenLoaded('drugs')),
        ];
    }
}
