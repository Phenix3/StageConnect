<?php

namespace App\Http\Controllers\Api\V1\Message;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Models\Application;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MessageController extends Controller
{
    private function authorizeApplication(Application $application, Request $request): void
    {
        $user = $request->user();
        $isStudent = $user->isStudent() && $user->studentProfile?->id === $application->student_id;
        $isCompany = $user->isCompany() && $user->companyProfile?->id === $application->offer->company_id;

        if (! $isStudent && ! $isCompany) {
            abort(403);
        }
    }

    public function index(Application $application, Request $request): AnonymousResourceCollection
    {
        $this->authorizeApplication($application, $request);

        return MessageResource::collection(
            $application->messages()->with('sender')->orderBy('created_at')->get()
        );
    }

    public function store(Application $application, Request $request): JsonResponse
    {
        $this->authorizeApplication($application, $request);

        $data = $request->validate(['body' => ['required', 'string', 'max:2000']]);

        $message = $application->messages()->create([
            'sender_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        return response()->json(new MessageResource($message->load('sender')), 201);
    }
}
