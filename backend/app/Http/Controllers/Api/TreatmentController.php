<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Treatment;
use App\Models\User;
use App\Http\Resources\Treatment as TreatmentResource;
use App\Http\Requests\TokenRequest;
use JWTAuth;

class TreatmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request)
    {
        $user = JWTAuth::authenticate($request->token);
        return TreatmentResource::collection($user->treatments);        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request):TreatmentResource
    {
        $user = JWTAuth::authenticate($request->token);
        return new TreatmentResource(
            Treatment::create(array_merge($request->all(), ['user_id' => $user->id]))
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(TokenRequest $request, $id):TreatmentResource
    {
        $user = JWTAuth::authenticate($request->token);
        return new TreatmentResource($user->treatments()->find($id));
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
        $treatment = $user->treatments()->find($id);
        $treatment->update($request->only(['title', 'description', 'algorithm', 'disease_id']));

        return new TreatmentResource($treatment);
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
        $treatment = $user->treatments()->find($id);
        if ($treatment === null) {
            return response()->json([
                'status' => 'error',
                'message' => "Treatment not found"
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR );
        }
        $treatment->delete();
        return response()->noContent();
    }
}
