<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Contact>
 */
class ContactFactory extends Factory
{
    protected $model = Contact::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'subject' => fake()->optional()->sentence(4),
            'message' => fake()->paragraphs(2, true),
            'is_read' => fake()->boolean(30),
            'read_at' => fn (array $attr) => $attr['is_read'] ? fake()->dateTimeBetween('-1 month') : null,
        ];
    }
}
