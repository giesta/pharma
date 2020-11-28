<?php

namespace App\Http\Traits;

trait ResponseApiToken
{
    /**
    * Get the token array structure.
    *
    * @param  string $token
    * @return \Illuminate\Http\JsonResponse
    */
    protected function respondWithToken($token)
    {
        $role = '';
        if(auth()->user() !== null){
            $role = auth()->user()->roles()->first()->name;
        }
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user'=>auth()->user(),
            'role'=>$role,
        ]);
    }
}