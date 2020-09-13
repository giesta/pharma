<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth',
    'namespace' => 'App\Http\Controllers\Api'
],function($router){
    Route::post('login', 'JwtAuthController@login');
    Route::post('register', 'JwtAuthController@register');
    
});

Route::group(['middleware' => 'jwt.auth',
    'namespace' => 'App\Http\Controllers\Api',

], function () {

    Route::get('logout', 'JwtAuthController@logout');
    Route::get('me', 'JwtAuthController@me');
    Route::get('refresh', 'JwtAuthController@refresh');

    Route::apiResource('diseases', DiseaseController::class);

    Route::apiResource('drugs', DrugController::class);

    Route::apiResource('treatments', TreatmentController::class);

});
