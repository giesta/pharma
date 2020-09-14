<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Disease;
use App\Http\Resources\Disease as DiseaseResource;
use App\Http\Requests\TokenRequest;

class DiseaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request)
    {
        return DiseaseResource::collection(Disease::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request): DiseaseResource
    {
        return new DiseaseResource(
            Disease::create($request->only(['name', 'description', 'symptoms']))
        );
    }

    /**
     * Return the specified resource.
     */
    public function show(TokenRequest $request, Disease $disease): DiseaseResource
    {
        return new DiseaseResource($disease);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TokenRequest $request, $id)
    {    
        $disease = Disease::findOrFail($id);
         
        $disease->update($request->only(['name', 'description', 'symptoms']));

        return new DiseaseResource($disease);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TokenRequest $request, $id)
    {
        $disease = Disease::findOrFail($id);
        $disease->delete();

        return response()->noContent();
    }
}