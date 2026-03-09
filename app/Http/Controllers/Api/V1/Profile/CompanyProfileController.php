<?php

namespace App\Http\Controllers\Api\V1\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyProfileResource;
use App\Models\CompanyProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyProfileController extends Controller
{
    public function show(int $id): JsonResponse
    {
        $profile = CompanyProfile::with('user')->findOrFail($id);

        return response()->json(new CompanyProfileResource($profile));
    }

    public function me(Request $request): JsonResponse
    {
        if (! $request->user()->isCompany()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $profile = $request->user()->companyProfile?->load('user');

        if (! $profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        return response()->json(new CompanyProfileResource($profile));
    }

    public function update(Request $request): JsonResponse
    {
        if (! $request->user()->isCompany()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'in:1-10,11-50,51-200,201-500,500+'],
            'description' => ['nullable', 'string', 'max:2000'],
            'website' => ['nullable', 'url', 'max:255'],
        ]);

        $profile = $request->user()->companyProfile()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json(new CompanyProfileResource($profile->load('user')));
    }
}
