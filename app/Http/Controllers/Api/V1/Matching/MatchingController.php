<?php

namespace App\Http\Controllers\Api\V1\Matching;

use App\Http\Controllers\Controller;
use App\Http\Resources\OfferResource;
use App\Services\MatchingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MatchingController extends Controller
{
    public function __construct(
        private readonly MatchingService $matchingService,
    ) {}

    public function recommended(Request $request): JsonResponse
    {
        if (! $request->user()->isStudent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $student = $request->user()->studentProfile;

        if (! $student) {
            return response()->json(['data' => [], 'message' => 'Complete your profile to get recommendations.']);
        }

        $student->loadMissing('skills');
        $recommendations = $this->matchingService->getRecommendedOffers($student, 20);

        return response()->json([
            'data' => $recommendations->map(fn ($r) => [
                'offer' => new OfferResource($r['offer']),
                'score' => $r['score'],
            ]),
        ]);
    }
}
