<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function store(Application $application, Request $request)
    {
        $user = $request->user();

        $isStudent = $user->isStudent() && $user->studentProfile?->id === $application->student_id;
        $isCompany = $user->isCompany() && $user->companyProfile?->id === $application->offer->company_id;

        if (! $isStudent && ! $isCompany) {
            abort(403);
        }

        if ($application->status !== 'accepted') {
            abort(422, 'Reviews can only be left for accepted applications.');
        }

        $type = $isStudent ? 'student_to_company' : 'company_to_student';
        $revieweeId = $isStudent
            ? $application->offer->company->user_id
            : $application->student->user_id;

        // Prevent duplicate reviews
        $existing = Review::where('application_id', $application->id)
            ->where('reviewer_id', $user->id)
            ->exists();

        if ($existing) {
            return back()->withErrors(['review' => 'You have already submitted a review for this application.']);
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        Review::create([
            'application_id' => $application->id,
            'reviewer_id' => $user->id,
            'reviewee_id' => $revieweeId,
            'type' => $type,
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? null,
        ]);

        return back()->with('success', 'Review submitted successfully.');
    }

    public function createForm(Application $application, Request $request): Response
    {
        $user = $request->user();
        $isStudent = $user->isStudent() && $user->studentProfile?->id === $application->student_id;
        $isCompany = $user->isCompany() && $user->companyProfile?->id === $application->offer->company_id;

        if (! $isStudent && ! $isCompany) {
            abort(403);
        }

        return Inertia::render('reviews/create', [
            'application' => $application->load(['offer', 'student.user']),
        ]);
    }
}
