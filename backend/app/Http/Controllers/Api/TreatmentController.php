<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Treatment;
use App\Http\Resources\Treatment as TreatmentResource;
use App\Http\Requests\TokenRequest;

class TreatmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request)
    {
        return TreatmentResource::collection(Treatment::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request):TreatmentResource
    {
        return new TreatmentResource(
            Treatment::create($request->only(['title', 'description', 'algorithm']))
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(TokenRequest $request, Treatment $treatment):TreatmentResource
    {
        return new TreatmentResource($treatment);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TokenRequest $request, Treatment $treatment)
    {
        $treatment->update($request->only(['title', 'description', 'algorithm']));

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
        $treatment = Treatment::findOrFail($id);
        $treatment->delete();

        return response()->noContent();
    }
}
