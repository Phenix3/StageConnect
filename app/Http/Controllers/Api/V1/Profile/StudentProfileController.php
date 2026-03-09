<?php

namespace App\Http\Controllers\Api\V1\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentProfileResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        if (! $request->user()->isStudent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $profile = $request->user()->studentProfile?->load(['user', 'skills']);

        if (! $profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return response()->json(new StudentProfileResource($profile));
    }

    public function update(Request $request): JsonResponse
    {
        if (! $request->user()->isStudent()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'bio' => ['nullable', 'string', 'max:1000'],
            'level' => ['nullable', 'in:bac,bac+1,bac+2,bac+3,bac+4,bac+5,bac+8'],
            'school' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'languages' => ['nullable', 'array'],
            'availability_from' => ['nullable', 'date'],
            'availability_to' => ['nullable', 'date'],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);

        $skillIds = $data['skill_ids'] ?? null;
        unset($data['skill_ids']);

        $profile = $request->user()->studentProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        if ($skillIds !== null) {
            $profile->skills()->sync($skillIds);
        }

        return response()->json(new StudentProfileResource($profile->load(['user', 'skills'])));
    }
}
