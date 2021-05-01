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

class CommentTest extends TestCase
{
    use RefreshDatabase;
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
        $data = [
            'content'=>'comment',
            'user_id'=> $user->id,      
            'treatment_id'=> $treatment->id,
        ];
        $response = $this->json('POST', '/api/comments?token='.$token, $data);
        $response->assertStatus(302);
    }
}
