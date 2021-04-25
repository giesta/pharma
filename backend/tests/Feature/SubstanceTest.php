<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Disease;
use App\Models\Substance;
use JWTAuth;
use Illuminate\Support\Str;

class SubstanceTest extends TestCase
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
        Substance::factory($number)->create();
        $response = $this->json('GET','/api/substances?token='.$token);

        $response->assertStatus(200)->assertJsonCount($number, 'data');

        $name = Str::random(5);
        Substance::factory()->create(['name' => $name]);
        $response = $this->json('GET','/api/substances?token='.$token.'&name='.$name);
        $response->assertStatus(200)->assertJsonCount(1, 'data')->assertJsonFragment(['name'=>$name]);
    }
}
