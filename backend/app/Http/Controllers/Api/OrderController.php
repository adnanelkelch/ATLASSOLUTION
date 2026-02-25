<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Pack;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with('items')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return $this->error('Unauthorized', 403);
        }

        $order->load('items');

        return $this->success(new OrderResource($order));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        return DB::transaction(function () use ($request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'total' => 0,
            ]);

            $total = 0;

            foreach ($request->items as $item) {
                $pack = Pack::findOrFail($item['pack_id']);
                $quantity = $item['quantity'];
                $totalPrice = $pack->price * $quantity;

                $order->items()->create([
                    'pack_id' => $pack->id,
                    'pack_name' => $pack->name,
                    'quantity' => $quantity,
                    'unit_price' => $pack->price,
                    'total_price' => $totalPrice,
                ]);

                $total += $totalPrice;
            }

            $order->update([
                'total' => $total,
                'notes' => $request->notes,
            ]);

            $order->load('items');

            return $this->success(new OrderResource($order), 'Order created successfully', 201);
        });
    }
}
