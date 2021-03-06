<?php

namespace App\Http\Controllers\Api;

use App\Models\Overview;
use Illuminate\Http\Request;
use Validator;
use JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Disease;
use App\Http\Resources\Overview as OverviewResource;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\TokenRequest;
use \Illuminate\Database\QueryException;

class OverviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        $name = $request->name;
        if($role ==="admin"){
            return OverviewResource::collection(Overview::with('leaflets')->select('overviews.*', 'diseases.id as did','diseases.name')->join('diseases', 'diseases.id', '=', 'overviews.disease_id')->where('diseases.name', 'LIKE', "%$name%")->limit(900)->get());           
        }else{
            return OverviewResource::collection($user->overviews()->with('leaflets')->select('overviews.*', 'diseases.id as did','diseases.name')->join('diseases', 'diseases.id', '=', 'overviews.disease_id')->where('diseases.name', 'LIKE', "%$name%")->limit(900)->get());  
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            if($name){
                return OverviewResource::collection(Overview::with('leaflets')->select('overviews.*', 'diseases.id as did','diseases.name')->join('diseases', 'diseases.id', '=', 'overviews.disease_id')->where('diseases.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return OverviewResource::collection(Overview::with('leaflets')->paginate(5));
            }
            
        }else{
            if($name){                
                return OverviewResource::collection($user->overviews()->with('leaflets')->select('overviews.*', 'diseases.id as did','diseases.name')->join('diseases', 'diseases.id', '=', 'overviews.disease_id')->where('diseases.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return OverviewResource::collection($user->overviews()->with('leaflets')->paginate(5));
            }            
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $validator = Validator::make($request->all(), 
        [ 
        'disease_id' => 'required',
        ]);  
 
        if ($validator->fails()) { 
            return response()->json(['message'=>$validator->errors()], 400);  
        }
        try{
            $overview = Overview::create(array_merge($request->all(), ['user_id' => $user->id]));
            
            $overview->symptoms()->attach(json_decode($request->symptoms));
            $drugs = json_decode($request->drugs);
            foreach($drugs as $drug){
                foreach($drug->selected as $selected){
                    $overview->drugs()->attach($selected, ['uses'=> $drug->uses]);
                }                
            }
            
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return (new OverviewResource(
            $user->overviews()->with('drugs')->findOrFail($overview->id)
        ))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $user = auth()->user();        
        return new OverviewResource($user->overviews()->with('drugs')->findOrFail($id));
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        $validator = Validator::make($request->all(), 
        [ 
        'disease_id' => 'required',
        ]);  
 
        if ($validator->fails()) { 
            return response()->json(['message'=>$validator->errors()], 400);  
        }
        if($role ==="admin"){
            $overview = Overview::findOrFail($id);
        }else{
            $overview = $user->overviews()->findOrFail($id);
        }        
        try{
            $overview->update($request->only(['description', 'diagnosis', 'prevention', 'disease_id']));
            $overview->symptoms()->sync(json_decode($request->symptoms));
            $drugs = json_decode($request->drugs);
            $tem = [];
            foreach($drugs as $drug){
                foreach($drug->selected as $selected){
                    $tem[$selected] = ['uses'=> $drug->uses];
                }                
            }$overview->drugs()->sync($tem);
        }
        catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex);
        }
        return new OverviewResource($overview->findOrFail($id));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = auth()->user();
            
        $overview = $user->overviews()->findOrFail($id);
        if($overview->treatments()->count()===0){
            $overview->drugs()->detach();
            $overview->symptoms()->detach();
            $overview->delete();
            return response()->noContent();
        }else{
            return response()->json([
                'success' => false,
                'message' => "Could not delete the overview",
            ], Response::HTTP_CONFLICT);
        }        
    }
}
