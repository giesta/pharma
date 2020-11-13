<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => 'c@c.com',
            'email_verified_at' => now(),
            'password' => '$2y$10$no1oQTjlEGGl0syZga85CuDE/lvlJQ2Si3mftIAanl6BiZiWAm0r2', // password
            'role' => 'admin',
            'remember_token' => Str::random(10),
        ];
    }
}
