<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $services = Service::orderBy('sort_order')->get();

        return $this->success(ServiceResource::collection($services));
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());

        return $this->success(new ServiceResource($service), 'Service created', 201);
    }

    public function show(Service $service): JsonResponse
    {
        return $this->success(new ServiceResource($service));
    }

    public function update(StoreServiceRequest $request, Service $service): JsonResponse
    {
        $service->update($request->validated());

        return $this->success(new ServiceResource($service), 'Service updated');
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return $this->success(null, 'Service deleted');
    }
}
