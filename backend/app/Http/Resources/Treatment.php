<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Disease as DiseaseResource;
use Illuminate\Support\Facades\Storage;

class Treatment extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            'algorithm' => env('APP_URL').Storage::url($this->algorithm),
            'disease' => new DiseaseResource($this->disease),
        ];
    }
}
