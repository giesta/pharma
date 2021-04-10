<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Overview as OverviewResource;
use App\Http\Resources\Comment as CommentResource;
use App\Http\Resources\Diagram as DiagramResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Config;
use App\Http\Resources\DrugWithUses as DrugResource;

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
        $path = '';
        if($this->algorithm!==''&&$this->algorithm!==null){
            $path = Config::get('app.url').Storage::url($this->algorithm);
        }
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'algorithm' => $path,
            'created' => date_format($this->created_at, 'Y-m-d'),
            'updated' => date_format($this->updated_at, 'Y-m-d'),
            'public' => $this->public,
            'stars' => $this->starsCount(),
            'isStar' => $this->isStarBy(auth()->user()),
            'isBlocked' => $this->reportsCount() >= 2,
            'isReported' => $this->isReportedBy(auth()->user()),
            'disease' => new OverviewResource($this->overview),
            'uses' => $this->uses,
            'drugs' => DrugResource::collection($this->drugs),
            'comments' => CommentResource::collection($this->comments()->orderBy("id", "desc")->get()),
            'diagram' => new DiagramResource($this->diagram)
        ];
    }
}
