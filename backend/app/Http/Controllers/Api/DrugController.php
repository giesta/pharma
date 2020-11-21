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
use App\Http\Requests\StoreDrugRequest;
use Illuminate\Database\Eloquent\ErrorException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use \Illuminate\Database\QueryException;

class DrugController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        if($user->role =="admin"){
            return DrugResource::collection(Drug::with('diseases')->get());
        }else{
            return DrugResource::collection($user->drugs()->with('diseases')->get());
        }        
    }
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        $user = auth()->user();
        if($user->role =="admin"){
            return DrugResource::collection(Drug::with('diseases')->paginate(5));
        }else{
            return DrugResource::collection($user->drugs()->with('diseases')->paginate(5));
        }        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDrugRequest $request)
    {
        $user = auth()->user();
        try{
            $drug = Drug::create(array_merge($request->all(), ['user_id' => $user->id]));  
            $drug->diseases()->attach(json_decode($request->diseases));      
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not create Drug");
        }
        return new DrugResource(
            $user->drugs()->with('diseases')->findOrFail($drug->id)
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $user = auth()->user();
        if($user->role ==="admin"){
            $drugs = Drug::with('diseases')->findOrFail($id);
            return new DrugResource($drugs);
        }else{      
            $drugs = $user->drugs()->with('diseases')->findOrFail($id);
            return new DrugResource($drugs);
        }
       
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        if($user->role ==="admin"){
            $drug = Drug::findOrFail($id);
        }else{
            $drug = $user->drugs()->findOrFail($id);
        }        
        try{
            $drug->update($request->only(['name', 'substance', 'indication', 'contraindication', 'reaction', 'use']));
            $drug->diseases()->sync(json_decode($request->diseases)); 
        }
        catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->message);
        }
        return new DrugResource($drug->with('diseases')->findOrFail($id));
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
            $drug = Drug::findOrFail($id);
        }else{
            $drug = $user->drugs()->findOrFail($id);
        } 
        $drug->diseases()->detach();
        $drug->delete();
        return response()->noContent();        
    }

}
