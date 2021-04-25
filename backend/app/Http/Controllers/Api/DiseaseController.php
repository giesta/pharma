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
        return DiseaseResource::collection(Disease::where('diseases.name', 'LIKE', "%$name%")->limit(900)->get());         
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
        $diseasesArr = json_decode($request->diseases);
        $data = array_values($this->makeDiseasesArray($diseasesArr));
        DB::table('diseases')->insert($data);
        return response()->json([
            'success' => true,
            'data' => count($data),
            'updated_at'=>date("Y-m-d\TH:i:s\Z"),
        ], Response::HTTP_CREATED);

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
    /**
     * Make the specified array
     * 
     * @param array $diseasesArr
     * @return array
     */
    private function makeDiseasesArray($diseasesArr){

        $data = [];
        for ($i = 0; $i < count($diseasesArr); $i++)
        {
            $data[$diseasesArr[$i]->data->{'Pavadinimas'}] = [
            'name' => $diseasesArr[$i]->data->{'Pavadinimas'},
            'created_at' => date("Y-m-d H:i:s"),
            ];          
        }        
        return $data;
    }
    /**
     * Returns when it was created and updated.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function report()
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){

            $disease = Disease::orderBy('created_at', 'desc')->first();
            if($disease !== null){
                return response()->json([
                'success' => true,
                'data' => [
                    'created_at' => $disease->created_at,
                    ],
                ], Response::HTTP_OK);
            }else{
                return response()->json([
                    'success' => false,
                    'data' => 'No Data',
                ], Response::HTTP_OK);
            }            
        }
        return response()->json([
            'success' => false,
            'data' => 'Restricted permission',
        ], Response::HTTP_FORBIDDEN);       
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateList(Request $request)
    {
        $user = auth()->user();
        $diseasesArr = json_decode($request->diseases);
        
        $newDiseasesArr = $this->makeDiseasesArray($diseasesArr);
        $diseases = Disease::orderBy('created_at', 'DESC')->get();
        $result = $this->checkDiseasesChanges($diseases, $newDiseasesArr);
        return response()->json([
            'success' => true,
            'data' => $result,
        ], Response::HTTP_OK);
    }
    /**
     * Make the specified array
     * 
     * @param array $drugsArr
     * @return array
     */
    private function checkDiseasesChanges($diseasesArr, $newDiseasesArr){

        $counter = 0;
        $date = $diseasesArr[0]->created_at;
        for ($i = 0; $i < count($diseasesArr); $i++)
        {
            if(isset($newDiseasesArr[$diseasesArr[$i]->name]))
            {               
                unset($newDiseasesArr[$diseasesArr[$i]->name]);
            }                    
        }
        if(count($newDiseasesArr) !== 0){            
            $values = array_values( $newDiseasesArr ); 
            $date = $values[0]['created_at'];
            DB::table('diseases')->insert($values);
        }              
        return ['updated'=>$counter, 'added'=>count( $newDiseasesArr ), 'updated_at' => date("Y-m-d\TH:i:s\Z",strtotime($date))];
    }
}
