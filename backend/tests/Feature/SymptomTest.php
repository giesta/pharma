<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Symptom;
use App\Models\Overview;
use JWTAuth;
use Illuminate\Support\Str;

class SymptomTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_symptoms_can_get_all_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        Symptom::factory($number)->create();
        $response = $this->json('GET','/api/symptoms?token='.$token);

        $response->assertStatus(200)->assertJsonCount($number, 'data');

        $name = Str::random(5);
        Symptom::factory()->create(['name' => $name]);

        $response = $this->json('GET','/api/symptoms?token='.$token.'&name='.$name);

        $response->assertStatus(200)->assertJsonCount(1, 'data')->assertJsonFragment(['name' => $name]);

    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_symptoms_can_be_saved_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $data =['symptoms'=>json_encode([['data'=>['Pavadinimas'=>'Skausmas']],['data'=>['Pavadinimas'=>'Sloga']]])];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/symptoms?token='.$token, $data);

        $response->assertCreated()->assertJsonFragment(['data'=>2]);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_symptoms_can_be_updated_true()
    {
        $this->seed();

        Symptom::factory()->create(['name'=>'Asarojimas']);

        $user = User::where('email', '=', 'a@a.com')->first();
        $data =['symptoms'=>json_encode([['data'=>['Pavadinimas'=>'Asarojimas']],['data'=>['Pavadinimas'=>'Sloga']],['data'=>['Pavadinimas'=>'Skausmas']]])];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/symptoms?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['success'=>true]);
    }

    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_symptoms_report_exist_true()
    {
        $this->seed();

        Symptom::factory()->create(['name'=>'Sloga']);

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/symptoms/reports?token='.$token);

        $response->assertOk();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_symptoms_report_no_exist_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/symptoms/reports?token='.$token);

        $response->assertOk();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_symptoms_report_only_admin_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/symptoms/reports?token='.$token);

        $response->assertForbidden();
    }
    
}
