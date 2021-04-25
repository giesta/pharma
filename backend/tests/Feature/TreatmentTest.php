<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Disease;
use App\Models\Diagram;
use App\Models\User;
use App\Models\Overview;
use App\Models\Symptom;
use App\Models\Treatment;
use App\Models\Drug;
use App\Models\Substance;
use JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class TreatmentTest extends TestCase
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
        $response = $this->json('GET','/api/treatments?token='.$token);

        $response->assertStatus(200);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_all_by_name_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        Treatment::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $name = Str::random(10);
        Treatment::factory()->for($user)->create(['title'=> $name]);
        $response = $this->json('GET','/api/treatments?token='.$token.'&name='.$name);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_list_by_name_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        Treatment::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $name = Str::random(10);
        Treatment::factory()->for($user)->create(['title'=> $name]);
        $response = $this->json('GET','/api/treatments/list?token='.$token.'&name='.$name);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_list_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,5);
        Treatment::factory()
                    ->count($number)
                    ->for($user)
                    ->create();
        $response = $this->json('GET','/api/treatments/list?token='.$token);

        $response->assertStatus(200)->assertJsonCount($number, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_public_list_by_name_true()
    {
        $this->seed();
        $number = rand(2,6);
        Treatment::factory()
                    ->count(3)
                    ->create();
        $name = Str::random(10);
        Treatment::factory()->create(['title'=> $name, 'public'=>1]);
        $response = $this->json('GET','/api/treatments/list?name='.$name);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_public_list_true()
    {
        $this->seed();
        $number = rand(2,5);
        Treatment::factory()
                    ->count($number)
                    ->create(['public'=>1]);
        $response = $this->json('GET','/api/treatments/list');

        $response->assertStatus(200)->assertJsonCount($number, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_private_list_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,5);
        Treatment::factory()
                    ->count($number)
                    ->for($user)
                    ->create(['public'=>0]);
        $response = $this->json('GET','/api/treatments/private?token='.$token);

        $response->assertStatus(200)->assertJsonCount($number, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_treatments_can_get_private_list_by_name_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        $name = Str::random(10);
        Treatment::factory()
                    ->count($number)
                    ->for($user)
                    ->create(['public'=>0]);
        Treatment::factory()
                    ->for($user)
                    ->create(['public'=>0, 'title' =>$name]);
        $response = $this->json('GET','/api/treatments/private?token='.$token.'&name='.$name);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_can_be_saved_true()
    {
        $this->seed();

        Storage::fake('avatars');        

        $user = User::where('email', '=', 'a@a.com')->first();
        $overview = Overview::factory()->create();
        $drug = Drug::factory()->create();
        
        $data=[
            'title' => Str::random(10),
            'description' => Str::random(5),
            'uses' => Str::random(5),
            'public' => rand(0,1),
            'algorithm' => UploadedFile::fake()->image('avatar.jpg'),
            'drugs' => json_encode([[
                'id'=>$drug->id,
                'uses' => Str::random(10),
            ]]),
            'overview_id' => $overview->id,
        ];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/treatments?token='.$token, $data);

        $response->assertCreated();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_can_be_updated_true()
    {
        $this->seed();

        Storage::fake('avatars');        

        $user = User::where('email', '=', 'a@a.com')->first();
        $overview = Overview::factory()->create();
        $treatment = Treatment::factory()->create();
        $drug = Drug::factory()->create();
        $name = Str::random(10);
        $data=[
            'title' => $name,
            'description' => Str::random(5),
            'uses' => Str::random(5),
            'public' => rand(0,1),
            'algorithm' => UploadedFile::fake()->image('avatar.jpg'),
            'drugs' => json_encode([[
                'id'=>$drug->id,
                'uses' => Str::random(10),
            ]]),
            'overview_id' => $overview->id,
        ];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/treatments/'.$treatment->id.'?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['title'=>$name]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_can_be_updated_without_image_true()
    {
        $this->seed();

        Storage::fake('avatars');        

        $user = User::where('email', '=', 'a@a.com')->first();
        $overview = Overview::factory()->create();
        $treatment = Treatment::factory()->create();
        $drug = Drug::factory()->create();
        $diagram = Diagram::factory()->create();
        $name = Str::random(10);
        $data=[
            'title' => $name,
            'description' => Str::random(5),
            'uses' => Str::random(5),
            'public' => rand(0,1),
            'algorithm' => Str::random(5),
            'drugs' => json_encode([[
                'id'=>$drug->id,
                'uses' => Str::random(10),
            ]]),
            'overview_id' => $overview->id,
            'diagram_id' => $diagram->id,
        ];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/treatments/'.$treatment->id.'?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['title'=>$name]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_can_be_deleted_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();

        $treatments = Treatment::factory()
                    ->count(3)
                    ->for($user)
                    ->create();
        $treatment = Treatment::first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('DELETE', '/api/treatments/'.$treatment->id.'?token='.$token);
        $response->assertNoContent();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_not_found_true()
    {
        $this->seed();
        
        $user = User::where('email', '=', 'a@a.com')->first();
             
        $token = JWTAuth::fromUser($user);
        $response = $this->json('GET', '/api/treatments/'.rand(11,50).'?token='.$token);
        $response->assertNotFound();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_unauthorized_true()
    {
        $this->seed();

        $response = $this->json('GET', '/api/treatments/1');
        $response->assertUnauthorized();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_rate_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
         
        $token = JWTAuth::fromUser($user);
        $treatments = Treatment::factory()
                    ->count(3)
                    ->for($user)
                    ->create(['public' => 1]);
        $treatment = Treatment::first();
        $response = $this->json('POST', '/api/rate/'.$treatment->id.'?token='.$token);
        $response->assertOk()->assertJsonFragment(['isStar'=>true]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_report_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
         
        $token = JWTAuth::fromUser($user);
        $treatments = Treatment::factory()
                    ->count(3)
                    ->for($user)
                    ->create(['public' => 1]);
        $treatment = Treatment::first();
        $response = $this->json('POST', '/api/report/'.$treatment->id.'?token='.$token);
        $response->assertOk()->assertJsonFragment(['isReported'=>true]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_treatments_report_blocked_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
         
        $token = JWTAuth::fromUser($user);
        $treatments = Treatment::factory()
                    ->count(3)
                    ->for($user)
                    ->create(['public' => 1]);
        $treatment = Treatment::first();
        $response = $this->json('POST', '/api/report/'.$treatment->id.'?token='.$token);
        $user = User::where('email', '=', 'b@b.com')->first();
         
        $token = JWTAuth::fromUser($user);
        $response = $this->json('POST', '/api/report/'.$treatment->id.'?token='.$token);
        $response->assertOk()->assertJsonFragment(['isReported'=>true]);
    }
}
