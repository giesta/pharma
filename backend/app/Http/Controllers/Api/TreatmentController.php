<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Treatment;
use App\Models\User;
use App\Models\Disease;
use App\Http\Resources\Treatment as TreatmentResource;
use App\Http\Requests\TokenRequest;
use App\Http\Requests\StoreTreatmentRequest;
use Illuminate\Database\Eloquent\Exception;
use Illuminate\Database\QueryException;
use JWTAuth;

class TreatmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        if($user->role ==="admin"){
            return TreatmentResource::collection(Treatment::all());
        }else{
            return TreatmentResource::collection($user->treatments);  
        }      
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTreatmentRequest $request)
    {
        $user = auth()->user();
        $disease = Disease::findOrFail($request->disease_id);
        if(!$request->hasFile('algorithm')) {
            return response()->json(['upload_file_not_found'], 400);
        }
        $path = $request->file('algorithm')->store('public/algorithms');
        try{
            $treatment = Treatment::create(array_merge($request->all(), ['user_id' => $user->id, 'algorithm'=>$path]));
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not create Treatment");
        }
        
        return new TreatmentResource(
            $treatment
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id):TreatmentResource
    {
        $user = auth()->user();
        if($user->role ==="admin"){
            $treatment = Treatment::findOrFail($id);
            return new TreatmentResource($treatment);
        }else{ 
            return new TreatmentResource($user->treatments()->findOrFail($id));
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreTreatmentRequest $request, $id)
    {
        $user = auth()->user();
        if($user->role ==="admin"){
            $treatment = Treatment::findOrFail($id);
        }else{
            $treatment = $user->treatments()->findOrFail($id);
        }
        if($request->hasFile('algorithm')) {
            $path = $request->file('algorithm')->store('public/algorithms');
            try{
                Storage::delete($treatment->algorithm);
                $treatment->update(array_merge($request->all(), ['algorithm'=>$path]));
            }
            catch (QueryException $ex) { // Anything that went wrong
                abort(500, "Could not update Treatment");
            } 
        }else{
            try{
                $treatment->update($request->only(['title', 'description', 'disease_id']));
            }
            catch (QueryException $ex) { // Anything that went wrong
                abort(500, "Could not update Treatment");
            }
        }
        return new TreatmentResource($treatment);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $user = auth()->user();
        if($user->role ==="admin"){
            $treatment = Treatment::findOrFail($id);
        }else{
            $treatment = $user->treatments()->findOrFail($id);
        }
        Storage::delete($treatment->algorithm);
        $treatment->delete();
        return response()->noContent();
    }
}
