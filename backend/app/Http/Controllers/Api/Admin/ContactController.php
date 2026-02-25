<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Contact::latest();

        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        $contacts = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => ContactResource::collection($contacts),
            'meta' => [
                'current_page' => $contacts->currentPage(),
                'last_page' => $contacts->lastPage(),
                'per_page' => $contacts->perPage(),
                'total' => $contacts->total(),
            ],
        ]);
    }

    public function show(Contact $contact): JsonResponse
    {
        if (!$contact->is_read) {
            $contact->update(['is_read' => true, 'read_at' => now()]);
        }

        return $this->success(new ContactResource($contact));
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return $this->success(null, 'Contact deleted');
    }
}
