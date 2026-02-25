<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Pack;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->admin()->create([
            'name' => 'Admin PMO',
            'email' => 'admin@pmo-expert.com',
        ]);

        $clients = User::factory(5)->create();

        $servicesData = [
            [
                'title' => 'Website Design & Development',
                'slug' => 'website-design-development',
                'excerpt' => 'Modern, high-converting websites built for speed, SEO, and user experience.',
                'description' => 'We design and build professional websites tailored to your brand and business goals. Every website is responsive, performance-optimized, and ready to convert visitors into customers.',
                'icon' => 'Globe',
                'is_featured' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Custom Web Applications',
                'slug' => 'custom-web-applications',
                'excerpt' => 'Scalable web apps that automate workflows and power your operations.',
                'description' => 'From internal tools to client-facing platforms, we develop secure and scalable web applications that solve real business problems and improve team productivity.',
                'icon' => 'Code',
                'is_featured' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'E-commerce Solutions',
                'slug' => 'ecommerce-solutions',
                'excerpt' => 'End-to-end online store development with smooth checkout and payment integration.',
                'description' => 'We create e-commerce experiences that are fast, easy to manage, and optimized for sales. Includes product management, secure checkout, payment gateways, and analytics setup.',
                'icon' => 'ShoppingCart',
                'is_featured' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'SEO & Performance Optimization',
                'slug' => 'seo-performance-optimization',
                'excerpt' => 'Improve rankings, page speed, and technical performance for better visibility.',
                'description' => 'We optimize site architecture, metadata, page speed, and technical SEO so your website ranks better and delivers a faster, smoother user experience.',
                'icon' => 'Search',
                'is_featured' => false,
                'sort_order' => 4,
            ],
            [
                'title' => 'UI/UX Design',
                'slug' => 'ui-ux-design',
                'excerpt' => 'User-centered interfaces designed to increase engagement and conversions.',
                'description' => 'Our design process focuses on clarity, accessibility, and conversion. We craft intuitive user journeys and visually strong interfaces that support your growth.',
                'icon' => 'Palette',
                'is_featured' => false,
                'sort_order' => 5,
            ],
            [
                'title' => 'Maintenance & Support',
                'slug' => 'maintenance-support',
                'excerpt' => 'Keep your platform secure, updated, and running smoothly with proactive support.',
                'description' => 'We provide ongoing maintenance, monitoring, updates, and technical support to ensure your website or app remains secure, stable, and aligned with your evolving needs.',
                'icon' => 'Shield',
                'is_featured' => false,
                'sort_order' => 6,
            ],
        ];

        foreach ($servicesData as $serviceData) {
            Service::create(array_merge($serviceData, [
                'image' => null,
                'is_active' => true,
            ]));
        }

        $packsData = [
            [
                'name' => 'Starter Pack',
                'slug' => 'starter-pack',
                'description' => 'A smart starting point for businesses that need a professional online presence.',
                'price' => 499,
                'original_price' => 699,
                'is_popular' => false,
                'sort_order' => 1,
                'features' => [
                    '5-page responsive website',
                    'Contact form integration',
                    'Basic SEO setup',
                    '3 months hosting included',
                    'SSL certificate included',
                ],
            ],
            [
                'name' => 'Business Pack',
                'slug' => 'business-pack',
                'description' => 'Ideal for growing businesses that need a strong and scalable digital presence.',
                'price' => 1499,
                'original_price' => 1999,
                'is_popular' => true,
                'sort_order' => 2,
                'features' => [
                    '10-page responsive website',
                    'Custom UI design',
                    'Blog integration',
                    'Advanced SEO optimization',
                    '1 year hosting included',
                    'Domain name included',
                    'Priority support',
                ],
            ],
            [
                'name' => 'Premium Pack',
                'slug' => 'premium-pack',
                'description' => 'A complete premium solution for brands that want performance, scale, and impact.',
                'price' => 2999,
                'original_price' => null,
                'is_popular' => false,
                'sort_order' => 3,
                'features' => [
                    'Complete e-commerce website',
                    'Premium custom design',
                    'Advanced SEO strategy',
                    'Admin training session',
                    '1 year hosting included',
                    '6 months maintenance',
                    '24/7 priority support',
                ],
            ],
        ];

        $packs = collect();
        foreach ($packsData as $packData) {
            $packs->push(Pack::create(array_merge($packData, [
                'is_active' => true,
            ])));
        }

        foreach ($clients as $client) {
            $order = Order::factory()->create([
                'user_id' => $client->id,
                'status' => fake()->randomElement(['pending', 'confirmed', 'in_progress', 'completed']),
            ]);

            $selectedPack = $packs->random();
            OrderItem::factory()->create([
                'order_id' => $order->id,
                'pack_id' => $selectedPack->id,
                'pack_name' => $selectedPack->name,
                'unit_price' => $selectedPack->price,
                'quantity' => 1,
                'total_price' => $selectedPack->price,
            ]);

            $order->update(['total' => $selectedPack->price]);
        }

        Contact::factory(8)->create();
    }
}
