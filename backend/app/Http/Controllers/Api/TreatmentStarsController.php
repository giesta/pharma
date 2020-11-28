<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Treatment;
use App\Http\Resources\Treatment as TreatmentResource;

class TreatmentStarsController extends Controller
{
    public function update(Request $request, $id){

        $treatment = Treatment::findOrFail($id);
        $treatment->star(auth()->user());
        return new TreatmentResource($treatment);
    }
}
