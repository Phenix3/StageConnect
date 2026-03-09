<?php

namespace App\Http\Controllers\Api\V1\Application;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ApplicationController extends Controller
{
    public function store(Request $request, Offer $offer): JsonResponse
    {
        if (! $request->user()->isStudent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $student = $request->user()->studentProfile;

        if (Application::where('offer_id', $offer->id)->where('student_id', $student->id)->exists()) {
            return response()->json(['message' => 'Already applied.'], 422);
        }

        $data = $request->validate(['cover_letter' => ['nullable', 'string', 'max:3000']]);

        $application = Application::create([
            'offer_id' => $offer->id,
            'student_id' => $student->id,
            'cover_letter' => $data['cover_letter'] ?? null,
        ]);

        return response()->json(new ApplicationResource($application->load(['offer.company', 'student'])), 201);
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $user = $request->user();

        if ($user->isStudent()) {
            $applications = Application::with(['offer.company'])
                ->where('student_id', $user->studentProfile?->id)
                ->orderByDesc('applied_at')
                ->paginate(15);
        } else {
            $company = $user->companyProfile;
            $applications = Application::with(['offer', 'student.user'])
                ->whereHas('offer', fn ($q) => $q->where('company_id', $company?->id))
                ->orderByDesc('applied_at')
                ->paginate(15);
        }

        return ApplicationResource::collection($applications);
    }

    public function accept(Request $request, Application $application): ApplicationResource
    {
        $this->authorize('accept', $application);
        $application->update(['status' => 'accepted']);

        return new ApplicationResource($application);
    }

    public function reject(Request $request, Application $application): ApplicationResource
    {
        $this->authorize('reject', $application);
        $application->update(['status' => 'rejected']);

        return new ApplicationResource($application);
    }

    public function withdraw(Request $request, Application $application): ApplicationResource
    {
        $this->authorize('withdraw', $application);
        $application->update(['status' => 'withdrawn']);

        return new ApplicationResource($application);
    }
}
