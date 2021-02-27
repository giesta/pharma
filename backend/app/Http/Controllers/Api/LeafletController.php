<?php

namespace App\Http\Controllers\Api;

use App\Models\Leaflet;
use Illuminate\Http\Request;
use App\Http\Resources\Leaflet as LeafletResource;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;

class LeafletController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $name = $request->name;
        $role = $user->roles()->first()->name;
        if($role =="admin"){
            return LeafletResource::collection(Leaflet::with(['diseases', 'drug'])->join('drugs', 'drugs.id', '=', 'leaflets.drug_id')->select('leaflets.*', 'drugs.substance')->where('drugs.substance', 'LIKE', "%$name%")->limit(900)->get());
        }else{
            return LeafletResource::collection($user->leaflets()->with(['diseases', 'drug'])->join('drugs', 'drugs.id', '=', 'leaflets.drug_id')->select('leaflets.*', 'drugs.substance')->where('drugs.substance', 'LIKE', "%$name%")->limit(900)->get());
        } 
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function list(Request $request)
    {
        $user = auth()->user();
        $name = $request->name;
        if($user!==null){
            $role = $user->roles()->first()->name;
            if($role =="admin"){
                if($name){
                    return LeafletResource::collection(Leaflet::with(['diseases', 'drug'])->join('drugs', 'drugs.id', '=', 'leaflets.drug_id')->where('drugs.substance', 'LIKE', "%$name%")->paginate(5));
                }else{
                    return LeafletResource::collection(Leaflet::with(['diseases', 'drug'])->paginate(5));
                }            
            }else{
                if($name){
                    return LeafletResource::collection($user->leaflets()->with(['diseases', 'drug'])->join('drugs', 'drugs.id', '=', 'leaflets.drug_id')->where('drugs.substance', 'LIKE', "%$name%")->paginate(5));
                }else{
                    return LeafletResource::collection($user->leaflets()->with(['diseases', 'drug'])->paginate(5));
                }            
            } 
        }else{
            if($name){
                return LeafletResource::collection(Leaflet::with('diseases')->join('drugs', 'drugs.id', '=', 'leaflets.drug_id')->where('drugs.substance', 'LIKE', "%$name%")->paginate(5));
            }else{
                return LeafletResource::collection(Leaflet::with(['diseases', 'drug'])->paginate(5));
            }            
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
        $user = auth()->user();

        try{
            $leaflet = Leaflet::create(array_merge($request->all(), ['user_id' => $user->id]));  
            $leaflet->diseases()->attach(json_decode($request->diseases));      
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, "Could not create Drugs Leaflet");
        }
        return LeafletResource::collection($user->leaflets()->with('diseases')->paginate(5));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\leaflet  $leaflet
     * @return \Illuminate\Http\Response
     */
    public function show(leaflet $leaflet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\leaflet  $leaflet
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $leaflet = Leaflet::findOrFail($id);
        }else{
            $leaflet = $user->leaflets()->findOrFail($id);
        }        
        try{
            $leaflet->update($request->only(['indication', 'contraindication', 'reaction', 'use', 'drug_id']));
            $leaflet->diseases()->sync(json_decode($request->diseases));
        }
        catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->message);
        }
        return new LeafletResource($leaflet->with('diseases')->findOrFail($id));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\leaflet  $leaflet
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            $leaflet = Leaflet::findOrFail($id);
        }else{
            $leaflet = $user->leaflets()->findOrFail($id);
        } 
        $leaflet->diseases()->detach();
        $leaflet->delete();
        return response()->noContent();
    }
}
