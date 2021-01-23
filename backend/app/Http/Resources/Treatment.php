<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Disease as DiseaseResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Config;

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
            'algorithm' => Config::get('app.url').Storage::url($this->algorithm),
            'created' => date_format($this->created_at, 'Y-m-d'),
            'updated' => date_format($this->updated_at, 'Y-m-d'),
            'public' => $this->public,
            'stars' => $this->starsCount(),
            'isStar' => $this->isStarBy(auth()->user()),
            'disease' => new DiseaseResource($this->disease),
            'comments' => $this->comments()->orderBy("id", "desc")->get()
        ];
    }
}
