<?php

namespace App\Http\Controllers\Api;

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
        return DrugResource::collection(Drug::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request):DrugResource
    {
        return new DrugResource(
            Drug::create($request->only(['name', 'substance', 'indication', 'contraindication', 'reaction', 'use']))
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(TokenRequest $request, Drug $drug):DrugResource
    {
        return new DrugResource($drug);
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
        $drug = Drug::findOrFail($id);
         
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
        $drug = Drug::findOrFail($id);
        $drug->delete();

        return response()->noContent();
    }
}
