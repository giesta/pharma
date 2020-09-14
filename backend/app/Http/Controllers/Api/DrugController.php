<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Drug;
use App\Http\Resources\Drug as DrugResource;
use App\Http\Requests\TokenRequest;

class DrugController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request)
    {
        $user = JWTAuth::authenticate($request->token);
        return DrugResource::collection($user->drugs);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request):DrugResource
    {
        $user = JWTAuth::authenticate($request->token);
        return new DrugResource(
            Drug::create(array_merge($request->all(), ['user_id' => $user->id]))
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(TokenRequest $request, $id):DrugResource
    {
        $user = JWTAuth::authenticate($request->token);
        return new DrugResource($user->drugs()->find($id));
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
        $drug = $user->drugs()->find($id);
         
        $drug->update($request->only(['name', 'substance', 'indication', 'contraindication', 'reaction', 'use']));

        return new DrugResource($drug);
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
        $drug = $user->drugs()->find($id);
        if ($drug === null) {
            return response()->json([
                'status' => 'error',
                'message' => "Drug not found"
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR );
        }
        $drug->diseases()->wherePivot('drug_id','=',$id)->delete();
        $drug->delete();

        return response()->noContent();
    }
}
