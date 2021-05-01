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
    Route::post('logout', 'JwtAuthController@logout');   
});

Route::group(['middleware' => 'jwt.auth',
    'namespace' => 'App\Http\Controllers\Api',

], function () {
    Route::get('treatments/list', 'TreatmentController@list'); 
    Route::get('treatments/private', 'TreatmentController@privateList');
    Route::get('treatments/{id}', 'TreatmentController@show');
});

Route::group(['middleware' => 'jwt.auth',
    'namespace' => 'App\Http\Controllers\Api',

], function () {
    
    Route::get('diseases/list', 'DiseaseController@list'); 
    Route::get('diseases/reports', 'DiseaseController@report'); 
    Route::put('diseases', 'DiseaseController@updateList');

    Route::get('drugs/list', 'DrugController@list');
    Route::get('drugs/reports', 'DrugController@report');
    Route::put('drugs', 'DrugController@updateList');
    Route::get('drugs/links', 'DrugController@updateLinks');

    Route::get('overviews/list', 'OverviewController@list');

    Route::get('diagrams/list', 'DiagramController@list');

    Route::get('symptoms/reports', 'SymptomController@report'); 
    Route::put('symptoms', 'SymptomController@updateList');
     
    Route::get('users/list', 'UserController@list'); 
    Route::apiResource('diseases', DiseaseController::class); 
    Route::apiResource('substances', SubstanceController::class);
    Route::apiResource('overviews', OverviewController::class);   
    Route::apiResource('drugs', DrugController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('diagrams', DiagramController::class);
    
    Route::apiResource('scrap', ScraperController::class);
    Route::apiResource('symptoms', SymptomController::class);
    Route::apiResource('treatments', TreatmentController::class);
    Route::post('rate/{id}', 'TreatmentController@rate');
    Route::post('report/{id}', 'TreatmentController@report');
    Route::post('comments', 'CommentController@store'); 
    

});
Route::get('treatments', 'App\Http\Controllers\Api\TreatmentController@index');
Route::group(['namespace' => 'App\Http\Controllers\Api',

], function () {

    
    

});
