<?php

namespace App\Http\Controllers\Api\V1\Review;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Application;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Application $application, Request $request): JsonResponse
    {
        $user = $request->user();
        $isStudent = $user->isStudent() && $user->studentProfile?->id === $application->student_id;
        $isCompany = $user->isCompany() && $user->companyProfile?->id === $application->offer->company_id;

        if (! $isStudent && ! $isCompany) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($application->status !== 'accepted') {
            return response()->json(['message' => 'Reviews can only be left for accepted applications.'], 422);
        }

        if (Review::where('application_id', $application->id)->where('reviewer_id', $user->id)->exists()) {
            return response()->json(['message' => 'Already reviewed.'], 422);
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $type = $isStudent ? 'student_to_company' : 'company_to_student';
        $revieweeId = $isStudent
            ? $application->offer->company->user_id
            : $application->student->user_id;

        $review = Review::create([
            'application_id' => $application->id,
            'reviewer_id' => $user->id,
            'reviewee_id' => $revieweeId,
            'type' => $type,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
        ]);

        return response()->json(new ReviewResource($review->load(['reviewer', 'reviewee'])), 201);
    }
}
