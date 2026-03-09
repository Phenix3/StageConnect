<?php

namespace App\Http\Controllers\Matching;

use App\Http\Controllers\Controller;
use App\Services\MatchingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MatchingController extends Controller
{
    public function __construct(
        private readonly MatchingService $matchingService,
    ) {}

    public function recommended(Request $request): Response
    {
        $student = $request->user()->studentProfile;

        if (! $student) {
            return Inertia::render('offers/recommended', ['offers' => []]);
        }

        $student->loadMissing('skills');
        $recommendations = $this->matchingService->getRecommendedOffers($student, 20);

        return Inertia::render('offers/recommended', [
            'offers' => $recommendations,
        ]);
    }
}
