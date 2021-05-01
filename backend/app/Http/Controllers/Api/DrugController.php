<?php

namespace App\Http\Controllers\Api;

use JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Drug;
use App\Models\Substance;
use App\Http\Resources\Drug as DrugResource;
use App\Http\Requests\TokenRequest;
use App\Http\Requests\StoreDrugRequest;
use App\Http\Requests\JsonImportRequest;
use Illuminate\Database\Eloquent\ErrorException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use \Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use App\Services\LinksService;

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
        return (DrugResource::collection(Drug::with('substance')->join('substances', 'substances.id', '=', 'drugs.substance_id')->select('drugs.*', 'substances.name as substance', 'substances.ATC')
        ->where('substances.name', 'LIKE', "%$name%")
        ->orWhere('drugs.name', 'LIKE', "%$name%")
        ->orWhere('substances.ATC', 'LIKE', "%$name%")->limit(100)->get()))->response()->setStatusCode(200);
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

            return DrugResource::collection(Drug::with('substance')->join('substances', 'substances.id', '=', 'drugs.substance_id')->select('drugs.*', 'substances.name as substance', 'substances.ATC')
            ->where('substances.name', 'LIKE', "%$name%")
            ->orWhere('drugs.name', 'LIKE', "%$name%")
            ->orWhere('substances.ATC', 'LIKE', "%$name%")->paginate(5));
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
        $values = array_values($this->saveDrugs($drugsArr));
        $chunk_data = array_chunk($values, 1);
        if (isset($chunk_data) && !empty($chunk_data)) {
            foreach ($chunk_data as $chunk_data_val) {
                DB::table('drugs')->insert($chunk_data_val);
            }
        }
        //DB::table('drugs')->insert($values);
        return response()->json([
            'success' => true,
            'data' => count($values),
            'updated_at'=>date("Y-m-d\TH:i:s\Z"),
        ], Response::HTTP_CREATED);
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
        $drugsArr = json_decode($request->drugs);
        $substances = Substance::orderBy('updated_at', 'desc')->orderBy('created_at', 'DESC')->get()->keyBy('name');
        $drugs = array();
        Drug::all()->map(function($item) use(&$drugs) {
            $drugs[$item->name.$item->strength.$item->form] = $item->toArray();
        });
        $result = $this->updateDrugs($drugsArr, $substances, $drugs);
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
    private function saveDrugs($drugsArr){

        $data = [];
        $substances = [];
        for ($i = 0; $i < count($drugsArr); $i++)
        {
            if(isset($substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) && !isset($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}])){
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}] = [
                    'name' => $drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'},
                    'strength' => $drugsArr[$i]->data->{'Stiprumas'},
                    'form' => $drugsArr[$i]->data->{'Farmacinė forma'},
                    'package' => $drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'},
                    'package_description' => $drugsArr[$i]->data->{'(pakuotės) Aprašymas'},
                    'substance_id' => $substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['id'],
                    'registration' => $drugsArr[$i]->data->{'Stadija'},
                    'created_at' => date("Y-m-d H:i:s"),
                    'updated_at' => date("Y-m-d H:i:s"),
                ];
            }
            elseif(isset($substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) && isset($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}])){
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']),strtolower($drugsArr[$i]->data->{'Stadija'})) === false) ? $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']."; ".$drugsArr[$i]->data->{'Stadija'} : $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'];
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']),strtolower($drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'})) === false) ? $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']."; ".$drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'} : $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'];
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']),strtolower($drugsArr[$i]->data->{'(pakuotės) Aprašymas'})) === false) ? $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']."; ".$drugsArr[$i]->data->{'(pakuotės) Aprašymas'} : $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'];
            }elseif(!isset($substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) && $drugsArr[$i]->data->{'VID'}!==""){
                
                $substance = Substance::create([
                    'name' => $drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'},
                    'name_en' => $drugsArr[$i]->data->{'Pavadinimas anglų kalba'},
                    'ATC' => $drugsArr[$i]->data->{'ATC kodas'},                    
                    'created_at' => date("Y-m-d H:i:s"),
                    'updated_at' => date("Y-m-d H:i:s"),
                ]);
                $substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}] = [
                    'id' => $substance->id,
                ];
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}] = [
                    'name' => $drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'},
                    'strength' => $drugsArr[$i]->data->{'Stiprumas'},
                    'form' => $drugsArr[$i]->data->{'Farmacinė forma'},
                    'package' => $drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'},
                    'package_description' => $drugsArr[$i]->data->{'(pakuotės) Aprašymas'},
                    'substance_id' => $substance->id,
                    'registration' => $drugsArr[$i]->data->{'Stadija'},
                    'created_at' => date("Y-m-d H:i:s"),
                    'updated_at' => date("Y-m-d H:i:s"),
                ];
            }            
        }       
        return $data;
    }
    /**
     * Make the specified array
     * 
     * @param array $drugsArr
     * @return array
     */
    private function updateDrugs($drugsArr, $oldSubstancesArr, $oldDrugsArr){

        $data = [];
        $substances = [];
        $counter = 0;
        $date=date("Y-m-d H:i:s");
        $array=[];

        for ($i = 0; $i < count($drugsArr); $i++)
        {
            $needle="/\b".strtolower($drugsArr[$i]->data->{'Stadija'})."\b/";
            $string = isset($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}])?strtolower($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']):'';
            if(isset($substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) && !isset($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]) && !isset($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}])){
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}] = [
                    'name' => $drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'},
                    'strength' => $drugsArr[$i]->data->{'Stiprumas'},
                    'form' => $drugsArr[$i]->data->{'Farmacinė forma'},
                    'package' => $drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'},
                    'package_description' => $drugsArr[$i]->data->{'(pakuotės) Aprašymas'},
                    'substance_id' => $substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['id'],
                    'registration' => $drugsArr[$i]->data->{'Stadija'},
                    'created_at' => date("Y-m-d H:i:s"),
                    'updated_at' => date("Y-m-d H:i:s"),
                ];
            }
            elseif(isset($substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) && isset($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}])){
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']),strtolower($drugsArr[$i]->data->{'Stadija'})) === false) ? $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']."; ".$drugsArr[$i]->data->{'Stadija'} : $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'];
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']),strtolower($drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'})) === false) ? $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']."; ".$drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'} : $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'];
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'] = (strpos(strtolower($data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']),strtolower($drugsArr[$i]->data->{'(pakuotės) Aprašymas'})) === false) ? $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']."; ".$drugsArr[$i]->data->{'(pakuotės) Aprašymas'} : $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'];
            }
            elseif(isset($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}])
                &&
                (
                    preg_match($needle, $string)===0||
                    strpos(strtolower($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']),strtolower($drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'})) === false ||
                    strpos(strtolower($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']),strtolower($drugsArr[$i]->data->{'(pakuotės) Aprašymas'})) === false
                )                
            )
            {
                $date = date("Y-m-d H:i:s");
                $array[$counter]=[
                    $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['name'],
                    $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'] ."->". $drugsArr[$i]->data->{'Stadija'}, 
                    $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'] ."->".  $drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'},
                    $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'] ."->".  $drugsArr[$i]->data->{'(pakuotės) Aprašymas'},                
                ];
                $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']=preg_match($needle, $string)===0?$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration']."; ".$drugsArr[$i]->data->{'Stadija'}:$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'];
            
                $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']=strpos(strtolower($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']),strtolower($drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'})) === false?$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package']."; ".$drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'}:$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'];
                $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']=strpos(strtolower($oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']),strtolower($drugsArr[$i]->data->{'(pakuotės) Aprašymas'})) === false?$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description']."; ".$drugsArr[$i]->data->{'(pakuotės) Aprašymas'}:$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'];
                $temp = [
                    'registration'=>$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['registration'],
                    'package'=>$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package'],
                    'package_description'=>$oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['package_description'],
                    'updated_at' => $date,
                ];
                Drug::where('id', $oldDrugsArr[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}]['id'])->update($temp);
                
                //unset($newDrugsArr[$drugsArr[$i]->substance]);
                $counter++;
                
            }
            elseif(!isset($oldSubstancesArr[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) &&!isset($substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]) && $drugsArr[$i]->data->{'VID'}!==""){
                
                $substance = Substance::create([
                    'name' => $drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'},
                    'name_en' => $drugsArr[$i]->data->{'Pavadinimas anglų kalba'},
                    'ATC' => $drugsArr[$i]->data->{'ATC kodas'},                    
                    'created_at' => date("Y-m-d H:i:s"),
                    'updated_at' => date("Y-m-d H:i:s"),
                ]);
                $substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}] = [
                    'id' => $substance->id,
                ];
                $data[$drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'}.$drugsArr[$i]->data->{'Stiprumas'}.$drugsArr[$i]->data->{'Farmacinė forma'}] = [
                    'name' => $drugsArr[$i]->data->{'Preparato (sugalvotas) pavadinimas'},
                    'strength' => $drugsArr[$i]->data->{'Stiprumas'},
                    'form' => $drugsArr[$i]->data->{'Farmacinė forma'},
                    'package' => $drugsArr[$i]->data->{'(pakuotės) Pakuotės tipas'},
                    'package_description' => $drugsArr[$i]->data->{'(pakuotės) Aprašymas'},
                    'substance_id' => $substances[$drugsArr[$i]->data->{'Veiklioji (-osios) medžiaga (-os)'}]['id'],
                    'registration' => $drugsArr[$i]->data->{'Stadija'},
                    'created_at' => date("Y-m-d H:i:s"),
                    'updated_at' => date("Y-m-d H:i:s"),
                ];
            }            
        }       
        return ['array'=>$array, 'updated'=>$counter, 'added_substances'=>count($substances), 'added_drugs'=>count($data), 'updated_at' => date("Y-m-d\TH:i:s\Z",strtotime($date))];
    }
    public function updateLinks(LinksService $linksService)
    {
        ini_set('max_execution_time', 10000);
        //$drugs = Drug::where('id','>', '8144')->get();
        $drugs = Drug::all();
        //$url = 'https://vapris.vvkt.lt/vvkt-web/public/medications?showData=true&mainSearchField=ranitidinas&strength=&pharmaceuticalForm=&atcCode=';
        $links = '';
        $url = '';
        $web = 'https://vapris.vvkt.lt';
        $downloadLink='https://vapris.vvkt.lt/vvkt-web/public/medications/view/';
        foreach ($drugs as $drug){
            $url = 'https://vapris.vvkt.lt/vvkt-web/public/medications?showData=true&mainSearchField='.$drug->name.'&strength='.$drug->strength.'&pharmaceuticalForm='.$drug->form;
            $links = $linksService->scrap($url, $web); 
            if(count($links)>0){
                Drug::where('id', $drug->id)->update(array('link' => $downloadLink.$links[0]));
            }            
        }
        return response()->json([
            'success' => true,
            'data' => $links,
        ], Response::HTTP_OK);
    }
}
