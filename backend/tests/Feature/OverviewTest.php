<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Http\Resources\Overview as OverviewResource;
use Illuminate\Database\Seeder;
use Tests\TestCase;
use App\Models\Disease;
use App\Models\User;
use App\Models\Overview;
use App\Models\Symptom;
use App\Models\Treatment;
use App\Models\Drug;
use App\Models\Substance;
use JWTAuth;
use Illuminate\Support\Str;

class OverviewTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_all_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $response = $this->json('GET','/api/overviews?token='.$token);

        $response->assertStatus(200);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_list_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        Overview::factory(2)->create();
        $response = $this->json('GET','/api/overviews/list?token='.$token);
        $json = $response->json();
        $response->assertStatus(200)->assertJsonCount(2, 'data');
        
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_be_saved_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $disease = Disease::create(['name' =>'Alergija']);
        $symptom = Symptom::create(['name' =>'Sloga']);
        $drug = Drug::factory()->create();
        
        $data=[
            'description' => Str::random(10),
            'diagnosis' => Str::random(5),
            'prevention' => Str::random(5),
            'disease_id' => $disease->id,
            'drugs' => json_encode([[
                'selected'=>[$drug->id],
                'uses' => Str::random(10),
            ]]),
            'symptoms' => json_encode([$symptom->id]),
        ];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/overviews?token='.$token, $data);

        $overview = Overview::first()->toArray();

        unset($overview['user_id']);
        unset($overview['created_at']);
        unset($overview['updated_at']);
        unset($data['disease_id']);
        unset($data['drugs']);
        unset($data['symptoms']);

        $response->assertCreated()->assertJsonFragment($overview)->assertJsonFragment($data);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_be_updated_true()
    {
        $this->seed();

        $symptom = Symptom::create(['name' =>'Sloga']);
        $user = User::where('email', '=', 'a@a.com')->first();
        $overviews = Overview::factory(1)->create();
        $drug = Drug::factory()->create();

        $overview = Overview::first();
        $data = $overview->toArray();
        $data['description'] = 'Test';
        $data['symptoms'] = json_encode([$symptom->id]);  
        $data['drugs'] = json_encode([[
            'selected'=>[$drug->id],
            'uses' => Str::random(10),
        ]]);

        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/overviews/'.$overview->id.'?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['description'=> $data['description']]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_be_deleted_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();

        $overviews = Overview::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $overview = Overview::first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/overviews/'.$overview->id.'?token='.$token);
        $response->assertNoContent();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_not_found_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('GET', '/api/overviews/'.rand(11,50).'?token='.$token);
        $response->assertNotFound();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_unauthorized_true()
    {
        $this->seed();
        $overviews = Overview::factory(1)->create();

        $overview = Overview::first();

        $response = $this->json('GET', '/api/overviews/'.$overview->id);
        $response->assertUnauthorized();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_not_be_deleted_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();

        $overviews = Overview::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $overview = Overview::first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/overviews/'.rand(11,50).'?token='.$token);
        $response->assertNotFound();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_not_be_deleted_has_treatment_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();        

        $overviews = Overview::factory()
                    ->count(3)
                    ->for($user)                    
                    ->create();

        $overview = Overview::first();
        $treatment = Treatment::factory(1)->for($overview)->create();

        
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/overviews/'.$overview->id.'?token='.$token);
        $response->assertStatus(409);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_not_be_updated_missed_disease_true()
    {
        $this->seed();

        $symptom = Symptom::create(['name' =>'Sloga']);
        $user = User::where('email', '=', 'a@a.com')->first();
        $overviews = Overview::factory(1)->create();

        $overview = Overview::first();
        $data = $overview->toArray();
        $data['description'] = 'Test';
        unset($data['disease_id']);

        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/overviews/'.$overview->id.'?token='.$token, $data);

        $response->assertStatus(400);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_can_not_be_saved_missed_disease_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $symptom = Symptom::create(['name' =>'Sloga']);

        $data=[
            'description' => Str::random(10),
            'diagnosis' => Str::random(5),
            'prevention' => Str::random(5),
            'drugs' => json_encode([]),
            'symptoms' => json_encode([$symptom->id]),
        ];  

        $token = JWTAuth::fromUser($user);
        $response = $this->json('POST', '/api/overviews?token='.$token, $data);
        $response->assertStatus(400);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_overviews_get_overview_by_id_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();
        $overviews = Overview::factory()
                    ->count(3)
                    ->for($user)
                    ->create();

        $overview = Overview::first();
             
        $token = JWTAuth::fromUser($user);
        var_dump($overview->id);
        $response = $this->json('GET', '/api/overviews/'.$overview->id.'?token='.$token);
        $response->assertOk()->assertJsonFragment(['id'=> $overview->id]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_list_by_name_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $name = Str::random(5);
        $disease = Disease::create(['name' =>$name]);
        Overview::factory()->create();
        $overviews = Overview::factory()
                    ->count(3)
                    ->for($disease)
                    ->create();
        $response = $this->json('GET','/api/overviews/list?token='.$token.'&name='.$name);
        $json = $response->json();
        $response->assertStatus(200)->assertJsonCount(3, 'data');
        
    }
}
