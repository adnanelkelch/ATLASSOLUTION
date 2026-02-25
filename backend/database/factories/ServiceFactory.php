<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    public function definition(): array
    {
        return [
            'title' => fake()->unique()->words(3, true),
            'slug' => fn (array $attr) => \Illuminate\Support\Str::slug($attr['title']),
            'excerpt' => fake()->sentence(10),
            'description' => fake()->paragraphs(3, true),
            'icon' => fake()->randomElement(['Globe', 'Code', 'Palette', 'Megaphone', 'Shield', 'Smartphone', 'Search', 'BarChart3']),
            'image' => null,
            'is_featured' => fake()->boolean(30),
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
