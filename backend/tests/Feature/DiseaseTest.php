<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Disease;
use App\Models\Overview;
use JWTAuth;
use Illuminate\Support\Str;

class DiseaseTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_diseases_can_get_all_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        Disease::factory($number)->create();
        $response = $this->json('GET','/api/diseases?token='.$token);

        $response->assertStatus(200)->assertJsonCount($number, 'data');
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
        $number = rand(2,6);
        Disease::factory($number)->create();
        $response = $this->json('GET','/api/diseases/list?token='.$token);
        $json = $response->json();
        $response->assertStatus(200)->assertJsonCount($number, 'data');
        
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
        $number = rand(2,6);
        $name = Str::random(10);
        Disease::factory()->create(['name'=>$name]);
        Disease::factory($number)->create();
        $response = $this->json('GET','/api/diseases/list?token='.$token.'&name='.$name);
        $json = $response->json();
        $response->assertStatus(200)->assertJsonCount(1, 'data');
        
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diseases_can_be_saved_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $data =['diseases'=>json_encode([['data'=>['Pavadinimas'=>'Alergija']],['data'=>['Pavadinimas'=>'Opa']]])];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/diseases?token='.$token, $data);

        $response->assertCreated()->assertJsonFragment(['data'=>2]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diseases_can_be_updated_true()
    {
        $this->seed();

        Disease::factory()->create(['name'=>'Alergija']);

        $user = User::where('email', '=', 'a@a.com')->first();
        $data =['diseases'=>json_encode([['data'=>['Pavadinimas'=>'Alergija']],['data'=>['Pavadinimas'=>'Opa']]])];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/diseases?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['success'=>true]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diseases_report_exist_true()
    {
        $this->seed();

        Disease::factory()->create(['name'=>'Alergija']);

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/diseases/reports?token='.$token);

        $response->assertOk();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diseases_report_no_exist_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/diseases/reports?token='.$token);

        $response->assertOk();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_diseases_report_only_admin_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/diseases/reports?token='.$token);

        $response->assertForbidden();
    }
}
