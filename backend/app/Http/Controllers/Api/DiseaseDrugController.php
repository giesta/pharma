<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
use App\Models\Disease;
use App\Models\Drug;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\TokenRequest;
use App\Http\Resources\Drug as DrugResource;
use App\Http\Resources\Disease as DiseaseResource;
use App\Http\Resources\DiseaseDrugs as DiseaseDrugsResource;
use \Illuminate\Database\QueryException;

class DiseaseDrugController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request, $id)
    {
        $user = JWTAuth::authenticate($request->token);
        return new DiseaseDrugsResource($user->diseases()->with('drugs')->findOrFail($id));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(TokenRequest $request, $disease_id)
    {
        $user = JWTAuth::authenticate($request->token);
        $disease = Disease::findOrFail($disease_id);

        $disease->drugs()->attach($request->drug_id);
        return new DiseaseResource(
            $user->diseases()->with('drugs')->findOrFail($disease_id)
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(TokenRequest $request, $disease_id, $drug_id)
    {
        $user = JWTAuth::authenticate($request->token);
        $diseases = $user->diseases()->findOrFail($disease_id);
        return new DrugResource($diseases->drugs()->findOrFail($drug_id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TokenRequest $request, $disease_id, $drug_id)
    {
        $user = JWTAuth::authenticate($request->token);
        $disease = Disease::findOrFail($disease_id); 
        $detachDrug = $disease->drugs()->findOrFail($drug_id)      ; 
        $drug = Drug::findOrFail($request->drug_id);
        try{
            $disease->drugs()->detach($drug_id);
            $attachedIds = $disease->drugs->pluck('id');
            $collectionOfId = collect($attachedIds);  
                   
            if(!$collectionOfId->contains($request->drug_id)){
                $disease->drugs()->attach($request->drug_id);
            }
            
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not add Drug");
        }       
        return new DiseaseResource(
            $user->diseases()->with('drugs')->findOrFail($disease_id)
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TokenRequest $request, $disease_id, $drug_id)
    {
        $user = JWTAuth::authenticate($request->token);
        $disease = Disease::findOrFail($disease_id);
        $drug = $disease->drugs()->findOrFail($drug_id);
        $disease->drugs()->detach($drug_id);
        return response()->noContent();
    }
}
