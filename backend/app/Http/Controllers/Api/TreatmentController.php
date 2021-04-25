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
use App\Models\Overview;
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
        $name = $request->name;
        if($user !== null){
            if($name){
                return TreatmentResource::collection($user->treatments()->where('treatments.title', 'LIKE', "%$name%")->paginate(5)); 
            }else{
                return TreatmentResource::collection($user->treatments()->paginate(5)); 
            }             
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
        $name = $request->name;
        if($user != null){            
            if($name){
                return TreatmentResource::collection($user->treatments()->where('treatments.title', 'LIKE', "%$name%")->paginate(5));
            }else{
                return TreatmentResource::collection($user->treatments()->paginate(5));
            } 
        }
        else{
            if($name){
                return TreatmentResource::collection(Treatment::where('treatments.title', 'LIKE', "%$name%")->where('treatments.public', '=', 1)->paginate(5));
            }else{
                return TreatmentResource::collection(Treatment::where('treatments.public', '=', 1)->paginate(5));
            }            
        }      
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function privateList(Request $request)
    {
        $user = auth()->user();
        $name = $request->name;
        if($user != null){            
            if($name){
                return TreatmentResource::collection($user->treatments()->where('treatments.title', 'LIKE', "%$name%")->where('treatments.public', '=', 0)->paginate(5));
            }else{
                return TreatmentResource::collection($user->treatments()->where('treatments.public', '=', 0)->paginate(5));
            }
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
        $path = "";
        $diseaseOverview = Overview::findOrFail($request->overview_id);
        
        if(!$request->hasFile('algorithm')) {
            if($request->has('algorithm')&&$request->algorithm!==''&&$request->algorithm!==null){
                $oldTreatment = Treatment::findOrFail($request->treatment_id);
                $type = explode("/", $oldTreatment->algorithm);
                $path = "public/algorithms/".date("YmdHis").$type[2];
                Storage::copy($oldTreatment->algorithm, $path);
            }            
        }else{
            $path = $request->file('algorithm')->store('public/algorithms');
        }
        
        try{
            $treatment = Treatment::create(array_merge($request->all(), ['user_id' => $user->id, 'algorithm'=>$path]));
            //$treatment->drugs()->attach(json_decode($request->drugs));
            $drugs = json_decode($request->drugs);
                $tem = [];
                foreach($drugs as $drug){
                    //$overview->drugs()->attach($drug->id, ['uses'=> $drug->uses]); 
                  $tem[$drug->id] = ['uses'=> $drug->uses];                              
                }
                $treatment->drugs()->attach($tem);
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->message);
        }
        //return response()->json(['neveikia'], 400);
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
        if($user !== null){
            $treatment = Treatment::where('treatments.public', '=', 1)->find($id);
            if($treatment !== null){
                return new TreatmentResource($treatment);
            }
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $treatment = Treatment::findOrFail($id);
        }else{
            $treatment = $user->treatments()->findOrFail($id);
        }
        if($request->hasFile('algorithm')) {
            $path = $request->file('algorithm')->store('public/algorithms');
            try{
                Storage::delete($treatment->algorithm);
                if($treatment->diagram!==null){
                    $treatment->diagram()->dissociate();
                }                
                $treatment->update(array_merge($request->except(['diagram_id']), ['algorithm'=>$path]));
                
                $drugs = json_decode($request->drugs);
                $tem = [];
                foreach($drugs as $drug){ 
                    $tem[$drug->id] = ['uses'=> $drug->uses];                              
                }
                $treatment->drugs()->sync($tem);
            }
            catch (QueryException $ex) { // Anything that went wrong
                abort(500, $ex->getMessage());
            } 
        }else{
            if($request->algorithm===''&&$treatment->algorithm!==''){
                Storage::delete($treatment->algorithm);
            }
            try{
                $treatment->update($request->only(['title', 'description', 'overview_id', 'public', 'dislikes', 'likes', 'diagram_id', 'algorithm', 'uses']));
                $drugs = json_decode($request->drugs);
                $tem = [];
                foreach($drugs as $drug){
                    $tem[$drug->id] = ['uses'=> $drug->uses];                              
                }
                $treatment->drugs()->sync($tem);
            }
            catch (QueryException $ex) { // Anything that went wrong
                abort(500, $ex->getMessage());
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
        $treatment = $user->treatments()->findOrFail($id);
        Storage::delete($treatment->algorithm);
        $treatment->drugs()->detach();
        $treatment->delete();
        return response()->noContent();
    }

    public function rate(Request $request, $id){

        $treatment = Treatment::findOrFail($id);
        $treatment->star(auth()->user());
        return new TreatmentResource($treatment);
    }

    /**
     * report to remove the treatment from public list.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Report  $report
     * @return \Illuminate\Http\Response
     */
    public function report(Request $request, $id)
    {
        $treatment = Treatment::findOrFail($id);
        $treatment->report(auth()->user());
        if($treatment->reportsCount() >= 2){
            $treatment->public = 0;
            $treatment->save();
        }
        return new TreatmentResource($treatment);
    }
}
