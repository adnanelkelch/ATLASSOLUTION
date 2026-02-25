<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackResource;
use App\Models\Pack;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PackController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $packs = Pack::active()
            ->orderBy('sort_order')
            ->orderBy('price')
            ->get();

        return $this->success(PackResource::collection($packs));
    }

    public function show(string $slug): JsonResponse
    {
        $pack = Pack::active()->where('slug', $slug)->firstOrFail();

        return $this->success(new PackResource($pack));
    }
}
