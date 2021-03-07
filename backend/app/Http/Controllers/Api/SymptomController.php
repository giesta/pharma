<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\SymptomsImportRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Symptom;

class SymptomController extends Controller
{
    /**
     * Get all the symptoms
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $name = $request->name;
        $symptoms = Symptom::where('symptoms.name', 'LIKE', "%$name%")->limit(900)->get();
        return response()->json([
            'success' => true,
            'data' => $symptoms,
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SymptomsImportRequest  $request)
    {
        $user = auth()->user();
        $symptomsArr = json_decode($request->symptoms);
        $data = $this->makeSymptomsArray($symptomsArr);
        DB::table('symptoms')->insert($data);
        return response()->json([
            'success' => true,
            'data' => count($data),
        ], Response::HTTP_OK);
    }
    /**
     * Make the specified array
     * 
     * @param array $symptomsArr
     * @return array
     */
    private function makeSymptomsArray($symptomsArr){

        $data = [];
        for ($i = 0; $i < count($symptomsArr)-1; $i++)
        {
            $data[] = [
            'name' => $symptomsArr[$i]->data->{'Pavadinimas'},
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

            $symptom = Symptom::orderBy('updated_at', 'desc')->first();
            if($symptom !== null){
                return response()->json([
                'success' => true,
                'data' => [
                    'created_at' => $symptom->created_at,
                    'updated_at' => $symptom->updated_at,
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
