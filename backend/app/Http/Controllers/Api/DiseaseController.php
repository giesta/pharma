<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
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
        $user = JWTAuth::authenticate($request->token);
        return DiseaseResource::collection($user->diseases()->with('drugs')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request): DiseaseResource
    {
        $user = JWTAuth::authenticate($request->token);
        return new DiseaseResource(
            Disease::create(array_merge($request->all(), ['user_id' => $user->id]))
        );
    }

    /**
     * Return the specified resource.
     */
    public function show(TokenRequest $request, $id): DiseaseResource
    {
        $user = JWTAuth::authenticate($request->token);
        return new DiseaseResource($user->diseases()->with('drugs')->find($id));
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
        $disease = $user->diseases()->find($id);
         
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
        $user = JWTAuth::authenticate($request->token);
        $disease = $user->diseases()->find($id);
        if ($disease === null) {
            return response()->json([
                'status' => 'error',
                'message' => "Disease not found"
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR );
        }
        $disease->drugs()->wherePivot('disease_id','=',$id)->delete();
        //Invoice::find($id)->delete();
        $disease->delete();

        return response()->noContent();
    }
}
