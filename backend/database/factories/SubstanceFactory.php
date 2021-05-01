<?php

namespace Database\Factories;

use App\Models\Substance;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SubstanceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Substance::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [       
            'name' => Str::random(10),
            'name_en' => Str::random(10),
            'ATC' => Str::random(10),                    
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s"),        
        ];
    }
}
