<?php
 
namespace App\Http\Controllers\Auth;
 
use JWTAuth;
use Validator;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Requests\Register\AuthRequest;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Traits\ResponseApiToken;
use App\Http\Requests\TokenRequest;
use App\Services\LicenseService;
 
class JwtAuthController extends Controller
{
    public $token = true;
    use ResponseApiToken;
  
    public function register(Request $request, LicenseService $licenseService)
    { 
         $validator = Validator::make($request->all(), 
                      [ 
                      'name' => 'required',
                      'last_name' => 'required',
                      'email' => 'required|email|unique:users',
                      'stamp_number' => 'required',
                      'password' => 'required',  
                      'c_password' => 'required|same:password', 
                     ]);  
 
        if ($validator->fails()) { 
            return response()->json(['message'=>$validator->errors()], 400);  
        } 
        $url = 'https://vapris.vvkt.lt/vvkt-web/public/personLicenses?nameFilter=&licenseType=7&licenseState=VALID&validFrom=&validTo=&licenceNumber='.$request->stamp_number;
        
        $data = $licenseService->scrap($url);
        if(empty($data) || $data[0]!==$request->name || $data[1]!==$request->last_name || $data[2] !== $request->stamp_number){
            return response()->json(['message'=>'No such pharmacist was found'], 401);
        }   
        $user = new User();
        $user->name = $request->name." ".$request->last_name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->save();
        $role = Role::find(2);
        $user->roles()->attach($role);
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
                'message' => 'Blogas el. pašto adresas arba slaptažodis!',
            ], Response::HTTP_UNAUTHORIZED);
        }  
        return $this->respondWithToken($jwt_token);
    }
  
    public function logout(Request $request)
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
            ], 422);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(Request $request)
    {
        try {
            return $this->respondWithToken(JWTAuth::refresh(JWTAuth::getToken()));
        } catch (JWTException $e) {
            return response()->json([
                'code'   => 103,
                'message' => 'Token cannot be refreshed, please Login again'
            ]);
        }

    }
    
}