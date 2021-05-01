<?php

namespace App\Http\Controllers\Api;

use App\Models\Substance;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Http\Resources\Substance as SubstanceResource;

class SubstanceController extends Controller
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
        return SubstanceResource::collection(Substance::with('drugs')->where('substances.name', 'LIKE', "%$name%")->limit(100)->get());
    }
}
