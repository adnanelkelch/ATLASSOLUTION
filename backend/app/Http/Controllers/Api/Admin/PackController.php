<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePackRequest;
use App\Http\Resources\PackResource;
use App\Models\Pack;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class PackController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $packs = Pack::orderBy('sort_order')->get();

        return $this->success(PackResource::collection($packs));
    }

    public function store(StorePackRequest $request): JsonResponse
    {
        $pack = Pack::create($request->validated());

        return $this->success(new PackResource($pack), 'Pack created', 201);
    }

    public function show(Pack $pack): JsonResponse
    {
        return $this->success(new PackResource($pack));
    }

    public function update(StorePackRequest $request, Pack $pack): JsonResponse
    {
        $pack->update($request->validated());

        return $this->success(new PackResource($pack), 'Pack updated');
    }

    public function destroy(Pack $pack): JsonResponse
    {
        $pack->delete();

        return $this->success(null, 'Pack deleted');
    }
}
