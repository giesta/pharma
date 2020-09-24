<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JWTAuth;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\User;
use App\Http\Resources\User as UserResource;
use App\Http\Requests\TokenRequest;
use Illuminate\Database\Eloquent\ErrorException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use \Illuminate\Database\QueryException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(TokenRequest $request)
    {
        $user = JWTAuth::authenticate($request->token);
        if($user->role === "admin"){
        return UserResource::collection(User::where('id', '!=', $user->id)->get());
        }else{
            abort(403, "Permission denied");
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return UserResource
     */
    public function show(TokenRequest $request, int $id)
    {
        $userCurrent = JWTAuth::authenticate($request->token);
        if($userCurrent->id === $id || $userCurrent->role === "admin"){
            $user = User::findOrFail($id);
            return new UserResource($user);
        }else{
            abort(403, "Permission denied");
        } 
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(TokenRequest $request, $id)
    {
        //$userCurrent = JWTAuth::authenticate($request->token);
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'email|unique:users'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()
            ]);
        } else {
            try {
                $userCurrent = JWTAuth::authenticate($request->token);
                if($userCurrent->id === $id || $userCurrent->role === "admin"){
                    $user = User::findOrFail($id);
                    $user->update($request->only(['name', 'email']));
                    return new UserResource($user);
                }else{
                    abort(403, "Permission denied");
                }
            }catch (QueryException $ex) { // Anything that went wrong
                abort(500, "Could not update User");
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(TokenRequest $request, $id)
    {
        try {
            $userCurrent = JWTAuth::authenticate($request->token);
            if($userCurrent->id != $id && $userCurrent->role === "admin"){
                $user = User::findOrFail($id);
                $user->delete();
                return response()->noContent();
            }else{
                abort(403, "Permission denied");
            }           
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not delete User");
        }
    }
}
