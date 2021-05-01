<?php

namespace App\Http\Controllers\Api;
use Validator;
use App\Models\Diagram;
use App\Models\Node;
use App\Models\Edge;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use App\Http\Resources\Diagram as DiagramResource;

class DiagramController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            return DiagramResource::collection(Diagram::with(['nodes', 'edges'])->get());           
        }else{
            return DiagramResource::collection($user->diagrams()->with(['nodes', 'edges'])->get());  
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
        $role = $user->roles()->first()->name;
        if($role ==="admin"){
            if($name){
                //return OverviewResource::collection(Overview::with('leaflets')->select('overviews.*', 'diseases.id as did','diseases.name')->join('diseases', 'diseases.id', '=', 'overviews.disease_id')->where('diseases.name', 'LIKE', "%$name%")->paginate(5));
                return DiagramResource::collection(Diagram::with(['nodes', 'edges'])->where('diagrams.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return DiagramResource::collection(Diagram::with(['nodes', 'edges'])->paginate(5));
            }
            
        }else{
            if($name){                
                return DiagramResource::collection($user->diagrams()->with(['nodes', 'edges'])->where('diagrams.name', 'LIKE', "%$name%")->paginate(5));
            }else{
                return DiagramResource::collection($user->diagrams()->with(['nodes', 'edges'])->paginate(5));
            }            
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
        $validator = Validator::make($request->all(), 
        [ 
        'name' => 'required',
        ]);  
 
        if ($validator->fails()) { 
            return response()->json(['message'=>$validator->errors()], 400);  
        }

        try{
            $diagram = Diagram::create(['name'=>$request->name,'user_id' => $user->id]);
            $nodes = json_decode($request->nodes);
            $edges = json_decode($request->edges);

            foreach($nodes as $node)
            {
                $container = new Node([
                    'item_id' => $node->item_id, 
                    'diagram_id' => $diagram->id, 
                    'label' => $node->data->{'label'}, 
                    'type'=>$node->type, 
                    'background' => $node->data->{'style'}->backgroundColor, 
                    'x' => $node->position->{'x'}, 
                    'y' => $node->position->{'y'},
                ]);
                $container->save();
            }
            foreach($edges as $edge)
            {
                $container = new Edge([
                    'item_id' => $edge->item_id, 
                    'diagram_id' => $diagram->id, 
                    'label' => $edge->label, 
                    'animated'=>$edge->animated?1:0, 
                    'stroke' => property_exists($edge->data->{'style'}, 'stroke')?$edge->data->{'style'}->stroke:'', 
                    'arrow' => $edge->arrowHeadType, 
                    'source' => $edge->source,
                    'target' => $edge->target,
                    'type' => $edge->type,
                ]);
                $container->save();
            }
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return response()->json([
            'success' => true,
            'data' => $diagram,
        ], Response::HTTP_CREATED);
    }

    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Diagram  $diagram
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), 
        [ 
        'name' => 'required',
        ]);  
 
        if ($validator->fails()) { 
            return response()->json(['message'=>$validator->errors()], 400);  
        }

        $diagram = $user->diagrams()->findOrFail($id);

        try{
            $diagram->update(array_merge($request->only(['name']), ['updated_at' => date("Y-m-d H:i:s")]));
            $diagram->nodes()->delete();
            $diagram->edges()->delete();
            $nodes = json_decode($request->nodes);
            $edges = json_decode($request->edges);

            foreach($nodes as $node)
            {
                $container = new Node([
                    'item_id' => $node->item_id, 
                    'diagram_id' => $diagram->id, 
                    'label' => $node->data->{'label'}, 
                    'type'=>$node->type, 
                    'background' => $node->data->{'style'}->backgroundColor, 
                    'x' => $node->position->{'x'}, 
                    'y' => $node->position->{'y'},
                ]);
                $container->save();
            }
            foreach($edges as $edge)
            {
                $container = new Edge([
                    'item_id' => $edge->item_id, 
                    'diagram_id' => $diagram->id, 
                    'label' => $edge->label, 
                    'animated'=>$edge->animated?1:0, 
                    'stroke' => isset($edge->data)&&property_exists($edge->data->{'style'}, 'stroke')?$edge->data->{'style'}->stroke:'', 
                    'arrow' => $edge->arrowHeadType, 
                    'source' => $edge->source,
                    'target' => $edge->target,
                    'type' => $edge->type,
                ]);
                $container->save();
            }
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return response()->json([
            'success' => true,
            'data' => $diagram,
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Diagram  $diagram
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $user = auth()->user();
        $diagram = $user->diagrams()->findOrFail($id);
        if($diagram->treatments()->count() === 0){
            $diagram->nodes()->delete();
            $diagram->edges()->delete();
            $diagram->delete();
            return response()->noContent();
        }else{
            return response()->json([
                'success' => false,
                'message' => "Could not delete the diagram",
            ], Response::HTTP_CONFLICT);
        }        
    }
}
