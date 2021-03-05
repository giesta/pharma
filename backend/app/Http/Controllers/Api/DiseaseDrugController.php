<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
use App\Models\Disease;
use App\Models\Overview;
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
    public function index(Request $request, $id)
    {
        $user = auth()->user();
        if($user !== null){
            $role = $user->roles()->first()->name;
            if($role ==="admin"){
                return new DiseaseDrugsResource(Overview::with('leaflets')->findOrFail($id));
            }else if($user !== null && $role ==="pharmacist"){
                return new DiseaseDrugsResource($user->overviews()->with('leaflets')->findOrFail($id));
            }
        }        
        else{
            return new DiseaseDrugsResource(Overview::with('leaflets')->findOrFail($id));
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $disease_id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::findOrFail($disease_id);
            $drug = Drug::findOrFail($request->drug_id);
        }else{
            $disease = $user->diseases()->findOrFail($disease_id);
            $drug = $user->drugs()->findOrFail($request->drug_id);
        }

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
    public function show(Request $request, $disease_id, $drug_id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($user !== null && $role ==="admin"){
            $diseases = Disease::findOrFail($disease_id);
        }else if($user !== null && $role ==="pharmacist"){
            $diseases = $user->diseases()->findOrFail($disease_id);
        }else{
            $diseases = Disease::findOrFail($disease_id);
        }
        return new DrugResource($diseases->drugs()->findOrFail($drug_id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $disease_id, $drug_id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::findOrFail($disease_id);
            $drug = Drug::findOrFail($request->drug_id); 
        }else{
            $disease = $user->diseases()->findOrFail($disease_id);
            $drug = $user->drugs()->findOrFail($request->drug_id); 
        }         
        $detachDrug = $disease->drugs()->findOrFail($drug_id);
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
    public function destroy(Request $request, $disease_id, $drug_id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::findOrFail($disease_id);
        }else{
            $disease = $user->diseases()->findOrFail($disease_id);
        }
        //$disease = Disease::findOrFail($disease_id);
        $drug = $disease->drugs()->findOrFail($drug_id);
        $disease->drugs()->detach($drug_id);
        return response()->noContent();
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteMany(Request $request, $id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::findOrFail($id);
        }else{
            $disease = $user->diseases()->findOrFail($id);
        }
        //$disease = Disease::findOrFail($disease_id);
        //$drug = $disease->drugs()->findOrFail($drug_id);
        $disease->drugs()->detach();
        return response()->noContent();
    }
}
