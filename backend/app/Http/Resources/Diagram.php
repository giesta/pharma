<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Diagram extends JsonResource
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
            'nodes' => $this->nodes,
            'edges' => $this->edges,
            'related_treatments' => $this->treatments,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}