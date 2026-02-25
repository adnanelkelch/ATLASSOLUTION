<?php

namespace Database\Factories;

use App\Models\Pack;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pack>
 */
class PackFactory extends Factory
{
    protected $model = Pack::class;

    public function definition(): array
    {
        $price = fake()->randomElement([499, 999, 1499, 1999, 2499, 2999, 4999]);

        return [
            'name' => fake()->unique()->words(2, true),
            'slug' => fn (array $attr) => \Illuminate\Support\Str::slug($attr['name']),
            'description' => fake()->paragraphs(2, true),
            'features' => fake()->randomElements([
                'Site vitrine responsive', 'Hébergement 1 an', 'Nom de domaine offert',
                'SEO de base', '5 pages', '10 pages', 'Blog intégré',
                'Formulaire de contact', 'Design sur mesure', 'Support prioritaire',
                'E-commerce', 'Maintenance 6 mois', 'Formation admin',
                'Optimisation performance', 'Certificat SSL',
            ], fake()->numberBetween(3, 8)),
            'price' => $price,
            'original_price' => fake()->boolean(40) ? $price * 1.2 : null,
            'is_popular' => fake()->boolean(20),
            'is_active' => true,
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
