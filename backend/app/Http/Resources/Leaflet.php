<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Overview as OverviewResource;

class Leaflet extends JsonResource
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
            'indication' => $this->indication,
            'contraindication' => $this->contraindication,
            'reaction' => $this->reaction,
            'use' => $this->use,
            'diseases' => OverviewResource::collection($this->whenLoaded('overviews')),
            'drug'=>$this->drug
        ];
    }
}