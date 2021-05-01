<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::factory(1)->create(['email'=>'a@a.com']);
        Role::create(['name' =>'admin']);
        Role::create([ 'name' =>'pharmacist']);
        $user = User::first();
        $role = Role::first();
        $user->roles()->attach($role);
        User::factory(1)->create(['name'=>'shiller','email'=>'b@b.com']);
        $user = User::find(2);
        $role = Role::find(2);
        $user->roles()->attach($role);
    }
}
