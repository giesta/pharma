<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Disease;
use App\Models\User;
use App\Models\Overview;
use App\Models\Symptom;
use App\Models\Treatment;
use App\Models\Diagram;
use App\Models\Substance;
use JWTAuth;
use Illuminate\Support\Str;

class DiagramTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_all_diagrams_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        
        $response = $this->json('GET','/api/diagrams?token='.$token);
        $response->assertStatus(200);

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);
        
        $response = $this->json('GET','/api/diagrams?token='.$token);
        $response->assertStatus(200);
        
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_diagrams_list_true()
    {
        $this->seed();

        $userAdmin = User::where('email', '=', 'a@a.com')->first();
        $tokenAdmin = JWTAuth::fromUser($userAdmin);
        
        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);

        Diagram::factory(2)->for($userAdmin)->create();
        $response = $this->json('GET','/api/diagrams/list?token='.$tokenAdmin);
        $response->assertStatus(200)->assertJsonCount(2, 'data');

        
        Diagram::factory(2)->for($user)->create();
        $response = $this->json('GET','/api/diagrams/list?token='.$token);
        $response->assertStatus(200)->assertJsonCount(2, 'data');

        $name = Str::random(5);
        Diagram::factory()->for($user)->create(['name'=>$name]);
        $response = $this->json('GET','/api/diagrams/list?token='.$tokenAdmin.'&name='.$name);
        $response->assertStatus(200)->assertJsonCount(1, 'data')->assertJsonFragment(['name'=>$name]);

        
        $name = Str::random(5);
        Diagram::factory()->for($user)->create(['name'=>$name]);
        $response = $this->json('GET','/api/diagrams/list?token='.$token.'&name='.$name);
        $response->assertStatus(200)->assertJsonCount(1, 'data')->assertJsonFragment(['name'=>$name]);
        
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_can_be_saved_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        
        $data=[
            'name' => Str::random(10),
            'nodes' => json_encode([[
                'item_id'=>rand(0,10),
                'data' => [
                    'label' => Str::random(5),
                    'style' =>[
                        'backgroundColor'=>Str::random(5),
                    ]
                    ],
                'position' =>[
                    'x'=>Str::random(5),
                    'y'=>Str::random(5),
                ],
                'type' => Str::random(5),
            ]]),
            'edges' => json_encode([[
                'item_id'=>rand(0,10),
                'label' => Str::random(5),
                'animated'=>rand(0,1),
                'data'=>[
                    'style' =>[
                        'backgroundColor'=>Str::random(5),
                    ]
                ],
                'arrowHeadType' => Str::random(5),
                'source' => Str::random(5),
                'target' => Str::random(5),
                'type' => Str::random(5),
            ]]),
        ];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/diagrams?token='.$token, $data);

        $diagram = Diagram::first()->toArray();

        $response->assertCreated()->assertJsonFragment(['name'=>$diagram['name']]);
        $data = [];
        $response = $this->json('POST', '/api/diagrams/?token='.$token, $data);
        $response->assertStatus(400);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_can_be_updated_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        Diagram::factory(2)->for($user)->create();
        $diagram = Diagram::first();
        $name = 'Test';
        $data=[
            'name' => $name,
            'nodes' => json_encode([[
                'item_id'=>rand(0,10),
                'data' => [
                    'label' => Str::random(5),
                    'style' =>[
                        'backgroundColor'=>Str::random(5),
                    ]
                    ],
                'position' =>[
                    'x'=>Str::random(5),
                    'y'=>Str::random(5),
                ],
                'type' => Str::random(5),
            ]]),
            'edges' => json_encode([[
                'item_id'=>rand(0,10),
                'label' => Str::random(5),
                'animated'=>rand(0,1),
                'data'=>[
                    'style' =>[
                        'backgroundColor'=>Str::random(5),
                    ]
                ],
                'arrowHeadType' => Str::random(5),
                'source' => Str::random(5),
                'target' => Str::random(5),
                'type' => Str::random(5),
            ]]),
        ];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/diagrams/'.$diagram->id.'?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['name'=>$name]);

        $data = [];
        $response = $this->json('PUT', '/api/diagrams/'.$diagram->id.'?token='.$token, $data);
        $response->assertStatus(400);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_can_be_deleted_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();

        $diagrams = Diagram::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $diagram = Diagram::first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/diagrams/'.$diagram->id.'?token='.$token);
        $response->assertNoContent();
    }
     /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_not_found_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/diagrams/'.rand(11,50).'?token='.$token);
        $response->assertNotFound();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_unauthorized_true()
    {
        $this->seed();
        $diagrams = Diagram::factory(1)->create();

        $diagram = Diagram::first();

        $response = $this->json('GET', '/api/diagrams/'.$diagram->id);
        $response->assertUnauthorized();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_can_not_be_deleted_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();

        $diagrams = Diagram::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $diagram = Diagram::first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/diagrams/'.rand(11,50).'?token='.$token);
        $response->assertNotFound();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diagrams_can_not_be_deleted_has_treatment_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();        

        $diagrams = Diagram::factory()
                    ->count(3)
                    ->for($user)                    
                    ->create();

        $diagram = Diagram::first();
        $treatment = Treatment::factory(1)->for($diagram)->create();

        
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/diagrams/'.$diagram->id.'?token='.$token);
        $response->assertStatus(409);
    }
}
