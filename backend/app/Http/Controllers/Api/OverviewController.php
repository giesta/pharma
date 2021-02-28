<?php

namespace App\Http\Controllers\Api;

use App\Models\Overview;
use Illuminate\Http\Request;

use JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Response;
use App\Models\Disease;
use App\Http\Resources\Overview as OverviewResource;
use App\Http\Requests\StoreDiseaseRequest;
use App\Http\Requests\TokenRequest;
use \Illuminate\Database\QueryException;

class OverviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            return OverviewResource::collection(Overview::with('leaflets')->get());
        }else{
            return OverviewResource::collection($user->overviews()->with('leaflets')->get());
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDiseaseRequest $request)
    {
        $user = auth()->user();
        try{
            $overview = Overview::create(array_merge($request->all(), ['user_id' => $user->id]));
            $overview->leaflets()->attach(json_decode($request->drugs));
            $overview->symptoms()->attach(json_decode($request->symptoms));
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return new OverviewResource(
            $user->overviews()->with('leaflets')->findOrFail($overview->id)
        );

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function show(Overviews $overviews)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function edit(Overviews $overviews)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Overviews $overviews)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Overviews  $overviews
     * @return \Illuminate\Http\Response
     */
    public function destroy(Overviews $overviews)
    {
        //
    }
}
