<?php

namespace App\Http\Controllers\Api\V1\Offer;

use App\Http\Controllers\Controller;
use App\Http\Resources\OfferResource;
use App\Models\Offer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OfferController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Offer::with(['company', 'skills'])->active()->orderByDesc('is_premium')->orderByDesc('created_at');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }
        if ($request->boolean('remote')) {
            $query->where('remote', true);
        }
        if ($request->filled('level')) {
            $query->where('level_required', $request->level);
        }

        return OfferResource::collection($query->paginate(15));
    }

    public function show(Offer $offer): OfferResource
    {
        return new OfferResource($offer->load(['company', 'skills']));
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->isCompany()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'duration' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:255'],
            'remote' => ['boolean'],
            'type' => ['required', 'in:stage,alternance,emploi'],
            'level_required' => ['nullable', 'in:bac,bac+1,bac+2,bac+3,bac+4,bac+5,bac+8'],
            'languages' => ['nullable', 'array'],
            'expires_at' => ['nullable', 'date', 'after:today'],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);

        $skillIds = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);
        $data['company_id'] = $request->user()->companyProfile->id;

        $offer = Offer::create($data);
        $offer->skills()->sync(array_fill_keys($skillIds, ['is_required' => true]));

        return response()->json(new OfferResource($offer->load(['company', 'skills'])), 201);
    }

    public function update(Request $request, Offer $offer): OfferResource
    {
        $this->authorize('update', $offer);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'duration' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:255'],
            'remote' => ['boolean'],
            'type' => ['sometimes', 'in:stage,alternance,emploi'],
            'level_required' => ['nullable', 'in:bac,bac+1,bac+2,bac+3,bac+4,bac+5,bac+8'],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);

        $skillIds = $data['skill_ids'] ?? null;
        unset($data['skill_ids']);

        $offer->update($data);
        if ($skillIds !== null) {
            $offer->skills()->sync(array_fill_keys($skillIds, ['is_required' => true]));
        }

        return new OfferResource($offer->load(['company', 'skills']));
    }

    public function destroy(Offer $offer): JsonResponse
    {
        $this->authorize('delete', $offer);
        $offer->delete();

        return response()->json(['message' => 'Offer deleted.']);
    }

    public function pause(Offer $offer): OfferResource
    {
        $this->authorize('pause', $offer);
        $offer->update(['status' => 'paused']);

        return new OfferResource($offer);
    }

    public function reopen(Offer $offer): OfferResource
    {
        $this->authorize('pause', $offer);
        $offer->update(['status' => 'active']);

        return new OfferResource($offer);
    }
}
