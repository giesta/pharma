<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Drug;
use JWTAuth;
use Illuminate\Support\Str;

class DrugsApiTest extends TestCase
{
    use RefreshDatabase;
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_drugs_can_get_all_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        Drug::factory($number)->create();
        $name = Str::random(10);
        Drug::factory()->create(['name'=> $name]);
        $response = $this->json('GET','/api/drugs?token='.$token.'&name='.$name);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_drugs_can_get_list_true()
    {
        $this->seed();
        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,5);
        Drug::factory($number)->create();
        $response = $this->json('GET','/api/drugs/list?token='.$token);
        $json = $response->json();
        $response->assertStatus(200)->assertJsonCount($number, 'data');
        
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_drugs_list_by_name_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);
        $number = rand(2,6);
        $name = Str::random(10);
        Drug::factory()->create(['name'=>$name]);
        Drug::factory($number)->create();
        $response = $this->json('GET','/api/drugs/list?token='.$token.'&name='.$name);
        $json = $response->json();
        $response->assertStatus(200)->assertJsonCount(1, 'data');
        
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_drugs_can_be_saved_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $data =['drugs'=>json_encode([
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'30mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ]
        )];
        $token = JWTAuth::fromUser($user);

        $response = $this->json('POST', '/api/drugs?token='.$token, $data);

        $response->assertCreated()->assertJsonFragment(['data'=>3]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_drugs_can_be_updated_true()
    {
        $this->seed();

        //Drugs::factory()->create(['name'=>'Alergija']);

        $user = User::where('email', '=', 'a@a.com')->first();
        
        $token = JWTAuth::fromUser($user);
        $data =['drugs'=>json_encode([
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'30mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ]
        )];
        $response = $this->json('POST', '/api/drugs?token='.$token, $data);
        $data =['drugs'=>json_encode([
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'11',
                'Stadija' =>'Isregistruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'30mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Ranigast',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N30',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Omeprazolis',
                'Pavadinimas anglų kalba' => 'Omeprasole',
                'Preparato (sugalvotas) pavadinimas' => 'Omep',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'20mg',
                'Farmacinė forma'=>'kapsules',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N30',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Omeprazolis',
                'Pavadinimas anglų kalba' => 'Omeprasole',
                'Preparato (sugalvotas) pavadinimas' => 'Gasec',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'40mg',
                'Farmacinė forma'=>'kapsules',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N30',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Omeprazolis',
                'Pavadinimas anglų kalba' => 'Omeprasole',
                'Preparato (sugalvotas) pavadinimas' => 'Gasec',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'40mg',
                'Farmacinė forma'=>'kapsules',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'11',
                'Stadija' =>'Perregistruotas',
                ]],
            ]
        )];
        $response = $this->json('PUT', '/api/drugs?token='.$token, $data);

        $response->assertOk()->assertJsonFragment(['success'=>true]);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_drugs_report_exist_true()
    {
        $this->seed();

        Drug::factory()->create();

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/drugs/reports?token='.$token);

        $response->assertOk();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_drugs_report_no_exist_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'a@a.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/drugs/reports?token='.$token);

        $response->assertOk();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_drugs_report_only_admin_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);

        $response = $this->json('GET', '/api/drugs/reports?token='.$token);

        $response->assertForbidden();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    function test_drugs_links_update_only_admin_true()
    {
        $this->seed();

        $user = User::where('email', '=', 'b@b.com')->first();
        $token = JWTAuth::fromUser($user);
        $data =['drugs'=>json_encode([
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'30mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Raniberl',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N10',
                'VID'=>'12',
                'Stadija' =>'Registruotas',
                ]],
            ['data'=>[
                'Veiklioji (-osios) medžiaga (-os)'=>'Ranitidinas',
                'Pavadinimas anglų kalba' => 'Ranitidine',
                'Preparato (sugalvotas) pavadinimas' => 'Mediran',
                'ATC kodas' => 'ANBS12554',
                'Stiprumas'=>'15mg',
                'Farmacinė forma'=>'tabletės',
                '(pakuotės) Pakuotės tipas' => 'plokstele',
                '(pakuotės) Aprašymas'=>'N20',
                'VID'=>'11',
                'Stadija' =>'Registruotas',
                ]],
            ]
        )];
        $response = $this->json('POST', '/api/drugs?token='.$token, $data);
        $response = $this->json('GET', '/api/drugs/links?token='.$token);

        $response->assertForbidden();
    }
}
