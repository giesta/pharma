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
use App\Http\Requests\JsonImportRequest;
use Illuminate\Database\Eloquent\ErrorException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use \Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

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
        $name = $request->name;      
        return DrugResource::collection(Drug::where('drugs.substance', 'LIKE', "%$name%")->limit(900)->get());
               
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
        if($user!==null){
            $role = $user->roles()->first()->name;
            if($role =="admin"){
                if($name){
                    return DrugResource::collection(Drug::with('diseases')->where('drugs.name', 'LIKE', "%$name%")->paginate(5));
                }else{
                    return DrugResource::collection(Drug::with('diseases')->paginate(5));
                }            
            }else{
                if($name){
                    return DrugResource::collection($user->drugs()->with('diseases')->where('drugs.name', 'LIKE', "%$name%")->paginate(5));
                }else{
                    return DrugResource::collection($user->drugs()->with('diseases')->paginate(5));
                }            
            } 
        }else{
            if($name){
                return DrugResource::collection(Drug::with('diseases')->where('drugs.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return DrugResource::collection(Drug::with('diseases')->paginate(5));
            }            
        }
               
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(JsonImportRequest  $request)
    {
        $user = auth()->user();

        //$drug = Drug::create(array_merge($request->all(), ['user_id' => $user->id]));
        //ini_set('memory_limit','1024M');
        $drugsArr = json_decode($request->drugs);
        $count = $this->makeDrugsArray($drugsArr, $user);
        return response()->json([
            'success' => true,
            'data' => $count,
        ], Response::HTTP_OK);
        
        /*
        try{
            $drug = Drug::create(array_merge($request->all(), ['user_id' => $user->id]));  
            $drug->diseases()->attach(json_decode($request->diseases));      
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not create Drug");
        }
        return new DrugResource(
            $user->drugs()->with('diseases')->findOrFail($drug->id)
        );*/
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $drug = Drug::findOrFail($id);
        }else{
            $drug = $user->drugs()->findOrFail($id);
        } 
        $drug->diseases()->detach();
        $drug->delete();
        return response()->noContent();        
    }
    private function makeDrugsArray($drugsArr, $user){

        $data = [];
        for ($i = 0; $i < count($drugsArr)-1; $i++)
        {
            if(isset($data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}])){
                $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['name'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['name']),strtolower($drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'})) === false) ? $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['name'].";".$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}."(".$drugsArr[$i]->data->{'Stadija'}.")" : $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['name'];
                $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['strength'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['strength']),strtolower($drugsArr[$i]->data->{'Stiprumas'})) === false) ? $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['strength'].";".$drugsArr[$i]->data->{'Stiprumas'} : $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['strength'];
                $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['form'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['form']),strtolower($drugsArr[$i]->data->{'Farmacinė forma'})) === false) ? $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['form'].";".$drugsArr[$i]->data->{'Farmacinė forma'} : $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['form'];
                $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package']),strtolower($drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'})) === false) ? $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package'].";".$drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'} : $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package'];
                $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package_description'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package_description']),strtolower($drugsArr[$i]->data->{'(pakuotės) Aprašymas'})) === false) ? $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package_description'].";".$drugsArr[$i]->data->{'(pakuotės) Aprašymas'} : $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['package_description'];
            }else{
                $data[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}] = [
                'substance' => $drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'},
                'substance_en' => $drugsArr[$i]->data->{'Pavadinimas anglų kalba'},
                'name' => $drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}."(".$drugsArr[$i]->data->{'Stadija'}.")",
                'ATC' => $drugsArr[$i]->data->{'ATC kodas'},
                'strength' => $drugsArr[$i]->data->{'Stiprumas'},
                'form' => $drugsArr[$i]->data->{'Farmacinė forma'},
                'package' => $drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'},
                'package_description' => $drugsArr[$i]->data->{'(pakuotės) Aprašymas'},
                'user_id' => $user->id
                ];
            }            
        }
        $values = array_values( $data );
        //$newArray = array_combine( $newKeys, $values );
        DB::table('drugs')->insert($values);
        
        return array_splice($values,-100);
    }
}
