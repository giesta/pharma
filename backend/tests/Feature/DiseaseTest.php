<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Disease;
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
}
