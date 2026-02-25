<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Order;
use App\Models\Pack;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        return $this->success([
            'users_count' => User::count(),
            'orders_count' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'revenue' => Order::whereIn('status', ['confirmed', 'in_progress', 'completed'])->sum('total'),
            'packs_count' => Pack::active()->count(),
            'unread_contacts' => Contact::unread()->count(),
            'recent_orders' => Order::with('user')->latest()->limit(5)->get()->map(fn ($o) => [
                'id' => $o->id,
                'reference' => $o->reference,
                'status' => $o->status,
                'total' => (float) $o->total,
                'user_name' => $o->user->name,
                'created_at' => $o->created_at,
            ]),
        ]);
    }
}
