<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Comment;
use App\Models\Treatment;
use App\Http\Resources\Treatment as TreatmentResource;

class CommentController extends Controller
{
    public function store(Request $request){
        $comment = Comment::create($request->all()); 
        $treatment = Treatment::findOrFail($request->treatment_id);
        return new TreatmentResource($treatment);
    }
}
