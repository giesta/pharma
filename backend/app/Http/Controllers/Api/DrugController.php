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
        $drugsArr = json_decode($request->drugs);
        $values = $this->makeDrugsArray($drugsArr);
        DB::table('drugs')->insert($values);
        return response()->json([
            'success' => true,
            'data' => count($values),
        ], Response::HTTP_OK);
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
    /**
     * Make the specified array
     * 
     * @param array $drugsArr
     * @return array
     */
    private function makeDrugsArray($drugsArr){

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
                'created_at' => date("Y-m-d H:i:s"),
                ];
            }            
        }
        $values = array_values( $data );       
        return $values;
    }
    /**
     * Return when it was created and updated.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function report()
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){

            $drug = Drug::orderBy('updated_at', 'desc')->first();
            if($drug !== null){
                return response()->json([
                'success' => true,
                'data' => [
                    'created_at' => $drug->created_at,
                    'updated_at' => $drug->updated_at,
                    ],
                ], Response::HTTP_OK);
            }else{
                return response()->json([
                    'success' => false,
                    'data' => 'Not Found',
                ], Response::HTTP_OK);
            }
            
        }
        return response()->json([
            'success' => false,
            'data' => 'Restricted permission',
        ], Response::HTTP_OK);       
    }
}
