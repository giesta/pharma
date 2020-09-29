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
    'namespace' => 'App\Http\Controllers\Auth'
],function($router){
    Route::post('login', 'JwtAuthController@login');
    Route::post('register', 'JwtAuthController@register');
    
});

Route::group([
    'middleware' => 'jwt.auth',
    'prefix' => 'auth',
    'namespace' => 'App\Http\Controllers\Auth'
],function($router){
    Route::get('logout', 'JwtAuthController@logout');
    Route::get('getMe', 'JwtAuthController@getMe');
    Route::get('refresh', 'JwtAuthController@refresh');
    //Route::resource('users', JwtAuthController::class);
    
});


Route::group(['middleware' => 'jwt.auth',
    'namespace' => 'App\Http\Controllers\Api',

], function () {

    Route::apiResource('diseases', DiseaseController::class);    
    Route::apiResource('drugs', DrugController::class);
    Route::resource('diseases.drugs', DiseaseDrugController::class);
    Route::apiResource('users', UserController::class);

    Route::apiResource('treatments', TreatmentController::class);

});
