<?php

namespace Database\Factories;

use App\Models\Treatment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Overview;
use App\Models\Diagram;
use App\Models\User;

class TreatmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Treatment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => Str::random(10),
            'description' => $this->faker->text,
            'algorithm' => $this->faker->text,
            'public' => rand(0,1),
            'user_id' => User::factory()->create()->id,
            'overview_id' => Overview::factory()->create()->id,
            'uses' => $this->faker->text,
            'diagram_id' => Diagram::factory()->create()->id,
        ];
    }
}
