<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Disease;
use App\Http\Resources\Disease as DiseaseResource;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\TokenRequest;
use \Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class DiseaseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        return DiseaseResource::collection(Disease::all());        
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
                return DiseaseResource::collection(Disease::with('leaflets')->where('diseases.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return DiseaseResource::collection(Disease::with('leaflets')->paginate(5));
            }
            
        }else{
            if($name){                
                return DiseaseResource::collection($user->diseases()->with('leaflets')->where('diseases.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return DiseaseResource::collection($user->diseases()->with('leaflets')->paginate(5));
            }            
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDiseaseRequest $request)
    {
        $user = auth()->user();

        $diseasesArr = json_decode($request->diseases);
        $count = $this->makeDiseasesArray($diseasesArr);
        return response()->json([
            'success' => true,
            'data' => $count,
        ], Response::HTTP_OK);
        /*try{
            $disease = Disease::create(array_merge($request->all(), ['user_id' => $user->id]));
            $disease->leaflets()->attach(json_decode($request->drugs));
            $disease->symptoms()->attach(json_decode($request->symptoms));
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return new DiseaseResource(
            $user->diseases()->with('leaflets')->findOrFail($disease->id)
        );*/

    }

    /**
     * Return the specified resource.
     */
    public function show(Request $request, $id): DiseaseResource
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::with('leaflets')->findOrFail($id);
            return new DiseaseResource($disease);
        }else{ 
            return new DiseaseResource($user->diseases()->with('leaflets')->findOrFail($id));
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::findOrFail($id);
        }else{
            $disease = $user->diseases()->findOrFail($id);
        }
        try{         
            $disease->update($request->only(['name', 'description']));
            $disease->leaflets()->sync(json_decode($request->drugs));
            $disease->symptoms()->sync(json_decode($request->symptoms));
        }
        catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return new DiseaseResource($disease->with('leaflets')->findOrFail($id));
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $disease = Disease::findOrFail($id);
        }else{
            $disease = $user->diseases()->findOrFail($id);
        }
        $disease->leaflets()->detach();
        $disease->symptoms()->detach();
        $disease->delete();

        return response()->noContent();
    }
    private function makeDiseasesArray($diseasesArr){

        $data = [];
        for ($i = 0; $i < count($diseasesArr)-1; $i++)
        {
            $data[] = [
            'name' => $diseasesArr[$i]->data->{'Pavadinimas'},
            ];          
        }
        //$values = array_values( $data );
        //$newArray = array_combine( $newKeys, $values );
        DB::table('diseases')->insert($data);
        
        return $data;
    }
}
