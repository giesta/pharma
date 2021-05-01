<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Treatment;
use JWTAuth;
use Illuminate\Support\Str;

class UserTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_users_can_get_all_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $response = $this->json('GET','/api/users?token='.$token);

        $response->assertStatus(200)->assertJsonCount(1, 'data');

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);
        $response = $this->json('GET','/api/users?token='.$token);
        $response->assertStatus(403);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_users_can_get_list_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET','/api/users/list?token='.$token);
        $response->assertStatus(200)->assertJsonCount(2, 'data');

        $name = 'shiller';
        $response = $this->json('GET','/api/users/list?token='.$token.'&name='.$name);
        $response->assertStatus(200)->assertJsonCount(1, 'data');

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);
        $response = $this->json('GET','/api/users/list?token='.$token);
        $response->assertStatus(403);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_users_can_get_user_true()
    {
        $this->seed();
        $userAdmin = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($userAdmin);
        $user = User::where('email', '=', 'b@b.com')->first();

        $response = $this->json('GET','/api/users/'.$user->id.'?token='.$token);
        $response->assertStatus(200)->assertJsonFragment(['id' => $user->id]);

        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET','/api/users/'.$userAdmin->id.'?token='.$token);        
        $response->assertStatus(403);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_users_can_be_updated_true()
    {
        $this->seed();

        $userAdmin = User::where('email', '=', 'a@a.com')->first();
        $user = User::where('email', '=', 'b@b.com')->first();

        $data =[
            'name'=> 'Tomas',
            'email' => 'b2@b.com',
        ];

        $token = JWTAuth::fromUser($userAdmin);

        $response = $this->json('PUT', '/api/users/'.$user->id.'?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['name' => 'shiller', 'email' => 'b2@b.com']);

        $token = JWTAuth::fromUser($user);

        $response = $this->json('PUT', '/api/users/'.$userAdmin->id.'?token='.$token, $data);

        $response->assertStatus(422);

        $data =[
            'name'=> 'Tomas',
            'email' => 'a@b.com',
        ];

        $response = $this->json('PUT', '/api/users/'.$userAdmin->id.'?token='.$token, $data);
        $response->assertStatus(403);

    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_users_can_be_deleted_true()
    {
        $this->seed();
        
        $userAdmin = User::where('email', '=', 'a@a.com')->first();

        $user = User::factory()->create();

        $oldUser = User::where('email', '=', 'b@b.com')->first();

        $token = JWTAuth::fromUser($oldUser);
        $response = $this->json('DELETE', '/api/users/'.$userAdmin->id.'?token='.$token);
        $response->assertStatus(403);

        $token = JWTAuth::fromUser($userAdmin);
        $response = $this->json('DELETE', '/api/users/'.$user->id.'?token='.$token);
        $response->assertNoContent();

        Treatment::factory()
            ->count(3)
            ->for($oldUser)
            ->create();             
        
        $response = $this->json('DELETE', '/api/users/'.$oldUser->id.'?token='.$token);
        $response->assertNoContent();       
    }
}
