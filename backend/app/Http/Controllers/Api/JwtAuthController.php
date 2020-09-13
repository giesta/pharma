<?php
 
namespace App\Http\Controllers\Api;
 
use JWTAuth;
use Validator;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\Register\AuthRequest;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Traits\ResponseApiToken;
use App\Http\Requests\Auth\TokenRequest;
 
class JwtAuthController extends Controller
{
    public $token = true;
    use ResponseApiToken;
  
    public function register(Request $request)
    {
 
         $validator = Validator::make($request->all(), 
                      [ 
                      'name' => 'required',
                      'email' => 'required|email',
                      'password' => 'required',  
                      'c_password' => 'required|same:password', 
                     ]);  
 
         if ($validator->fails()) {  
 
               return response()->json(['error'=>$validator->errors()], 401); 
 
            }   
 
 
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->save();
  
        if ($this->token) {
            return $this->login($request);
        }
  
        return response()->json([
            'success' => true,
            'data' => $user
        ], Response::HTTP_OK);
    }
  
    public function login(Request $request)
    {
        $input = $request->only('email', 'password');
        $jwt_token = null;
  
        if (!$jwt_token = JWTAuth::attempt($input)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Password',
            ], Response::HTTP_UNAUTHORIZED);
        }
  
        return $this->respondWithToken($jwt_token);
    }
  
    public function logout(TokenRequest $request)
    {
        try {
            JWTAuth::invalidate($request->token);
  
            return response()->json([
                'success' => true,
                'message' => 'User logged out successfully'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the user cannot be logged out'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(TokenRequest $request)
    {
        try {
            return $this->respondWithToken(auth()->refresh());

        } catch (JWTException $e) {
            return $this->json(['message' => "Error: {$e->getMessage()}"], 500);
        }

    }
  
    public function me(TokenRequest $request)
    {
        $user = JWTAuth::authenticate($request->token);

        return response()->json(['user' => $user]);
    }
}