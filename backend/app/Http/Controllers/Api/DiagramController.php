<?php

namespace App\Http\Controllers\Api;

use App\Models\Diagram;
use App\Models\Node;
use App\Models\Edge;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class DiagramController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //$diseasesArr = json_decode($request->diseases);
        //$data = array_values($this->makeDiseasesArray($diseasesArr));
        //DB::table('diseases')->insert($data);

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
            //$overview->leaflets()->attach(json_decode($request->drugs));
            //$overview->symptoms()->attach(json_decode($request->symptoms));
        }catch (QueryException $ex) { // Anything that went wrong
            abort(500, $ex->getMessage());
        }
        return response()->json([
            'success' => true,
            'data' => $diagram,
        ], Response::HTTP_OK);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Diagram  $diagram
     * @return \Illuminate\Http\Response
     */
    public function show(Diagram $diagram)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Diagram  $diagram
     * @return \Illuminate\Http\Response
     */
    public function edit(Diagram $diagram)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Diagram  $diagram
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Diagram $diagram)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Diagram  $diagram
     * @return \Illuminate\Http\Response
     */
    public function destroy(Diagram $diagram)
    {
        //
    }
}
