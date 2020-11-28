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
    Route::post('refresh', 'JwtAuthController@refresh');
    
});


Route::group([
    'middleware' => 'jwt.auth',
    'prefix' => 'auth',
    'namespace' => 'App\Http\Controllers\Auth'
],function($router){
    Route::get('logout', 'JwtAuthController@logout');
    Route::get('getMe', 'JwtAuthController@getMe');    
});

Route::group(['middleware' => 'jwt.auth',
    'namespace' => 'App\Http\Controllers\Api',

], function () {
    Route::get('treatments/list', 'TreatmentController@list'); 
    Route::get('treatments/private', 'TreatmentController@privateList');
});

Route::get('treatments/{id}', 'App\Http\Controllers\Api\TreatmentController@show');
Route::get('diseases/{id}/drugs', 'App\Http\Controllers\Api\DiseaseDrugController@index');
Route::get('treatments/list', 'App\Http\Controllers\Api\TreatmentController@list'); 

Route::group(['middleware' => 'jwt.auth',
    'namespace' => 'App\Http\Controllers\Api',

], function () {
    
    Route::get('diseases/list', 'DiseaseController@list'); 
    Route::get('drugs/list', 'DrugController@list');
     
    Route::get('users/list', 'UserController@list'); 
    Route::apiResource('diseases', DiseaseController::class);   
    Route::apiResource('drugs', DrugController::class);
    Route::resource('diseases.drugs', DiseaseDrugController::class);
    Route::delete('diseases/{id}/drugs', 'DiseaseDrugController@deleteMany');
    Route::apiResource('users', UserController::class);
    
    Route::apiResource('treatments', TreatmentController::class);
    Route::post('stars/{id}', 'TreatmentStarsController@update'); 
    

});
Route::get('treatments', 'App\Http\Controllers\Api\TreatmentController@index');
Route::group(['namespace' => 'App\Http\Controllers\Api',

], function () {

    
    

});
