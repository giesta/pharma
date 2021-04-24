<?php

namespace Database\Factories;

use App\Models\Overview;
use App\Models\Disease;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OverviewFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Overview::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'description' => Str::random(10),
            'diagnosis' => $this->faker->text,
            'prevention' => $this->faker->text,
            'disease_id' => Disease::factory()->create()->id,
            'user_id' => User::factory()->create()->id
        ];
    }
}
