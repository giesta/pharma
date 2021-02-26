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
        $symptoms = Symptom::where('symptoms.name', 'LIKE', "%$name%")->limit(100)->get();
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
        $count = $this->makeSymptomsArray($symptomsArr);
        return response()->json([
            'success' => true,
            'data' => $count,
        ], Response::HTTP_OK);
    }
    private function makeSymptomsArray($symptomsArr){

        $data = [];
        for ($i = 0; $i < count($symptomsArr)-1; $i++)
        {
            $data[] = [
            'name' => $symptomsArr[$i]->data->{'Pavadinimas'},
            ];          
        }
        //$values = array_values( $data );
        //$newArray = array_combine( $newKeys, $values );
        DB::table('symptoms')->insert($data);
        
        return $data;
    }
}
