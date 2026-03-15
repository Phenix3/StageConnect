<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function toggle(Request $request, Offer $offer): JsonResponse
    {
        $student = $request->user()->studentProfile;

        if (! $student) {
            return response()->json(['error' => 'Profile not found'], 404);
        }

        $result = $student->savedOffers()->toggle($offer->id);
        $saved = count($result['attached']) > 0;

        return response()->json(['saved' => $saved]);
    }
}
