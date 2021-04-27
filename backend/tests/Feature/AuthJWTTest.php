<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use JWTAuth;

class AuthTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_login()
    {
        $data = [
            'email'=>'a@a.com',
            'password' => '123456'
        ];
        $response = $this->json('POST', '/api/auth/login/', $data);
        $response->assertUnauthorized();

        $this->seed();
        $response = $this->json('POST', '/api/auth/login/', $data);

        $response->assertStatus(200)->assertJsonStructure([
            'access_token', 'token_type', 'expires_in'
        ]);;
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_logout()
    {
        $this->seed();
        
        $user = User::where('email', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/auth/logout/?token='.$token);
        $response->assertStatus(200)->assertJsonFragment(['success' => true, 'message' => 'User logged out successfully']);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_refresh()
    {
        $this->seed();
        
        $user = User::where('email', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/auth/refresh/?token='.$token);
        $response->assertStatus(200)->assertJsonStructure(['access_token', 'token_type', 'expires_in']);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_register()
    {
        $data = [
            'email'=>'a@a.com',
            'password' => '123456'
        ];
        $response = $this->json('POST', '/api/auth/register/', $data);
        $response->assertStatus(400);
    }
}
