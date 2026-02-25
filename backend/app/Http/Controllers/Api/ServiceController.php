<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $services = Service::active()
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get();

        return $this->success(ServiceResource::collection($services));
    }

    public function featured(): JsonResponse
    {
        $services = Service::active()
            ->featured()
            ->orderBy('sort_order')
            ->limit(6)
            ->get();

        return $this->success(ServiceResource::collection($services));
    }

    public function show(string $slug): JsonResponse
    {
        $service = Service::active()->where('slug', $slug)->firstOrFail();

        return $this->success(new ServiceResource($service));
    }
}
