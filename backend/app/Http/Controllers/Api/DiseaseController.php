<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Disease;
use App\Http\Resources\Disease as DiseaseResource;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\TokenRequest;
use \Illuminate\Database\QueryException;

class DiseaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request)
    {
        $user = JWTAuth::authenticate($request->token);
        if($user->role ==="admin"){
            return DiseaseResource::collection(Disease::all());
        }else{
            return DiseaseResource::collection($user->diseases()->with('drugs')->get());
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDiseaseRequest $request): DiseaseResource
    {
        $user = JWTAuth::authenticate($request->token);
        try{
            $disease = Disease::create(array_merge($request->all(), ['user_id' => $user->id]));
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not create Disease");
        }
        return new DiseaseResource(
            $disease
        );
    }

    /**
     * Return the specified resource.
     */
    public function show(TokenRequest $request, $id): DiseaseResource
    {
        $user = JWTAuth::authenticate($request->token);
        if($user->role ==="admin"){
            $disease = Disease::with('drugs')->findOrFail($id);
            return new DiseaseResource($disease);
        }else{ 
            return new DiseaseResource($user->diseases()->with('drugs')->findOrFail($id));
        }
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
        $user = JWTAuth::authenticate($request->token);
        if($user->role ==="admin"){
            $disease = Disease::findOrFail($id);
        }else{
            $disease = $user->diseases()->findOrFail($id);
        }
        try{         
            $disease->update($request->only(['name', 'description', 'symptoms']));
        }
        catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not update Disease");
        }

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
        $user = JWTAuth::authenticate($request->token);
        if($user->role ==="admin"){
            $disease = Disease::findOrFail($id);
        }else{
            $disease = $user->diseases()->findOrFail($id);
        }
        $disease->drugs()->wherePivot('disease_id','=',$id)->delete();
        $disease->delete();

        return response()->noContent();
    }
}
