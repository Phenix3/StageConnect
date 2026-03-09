<?php

namespace App\Http\Controllers\Offer;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOfferRequest;
use App\Models\Offer;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OfferController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Offer::with(['company', 'skills'])
            ->active()
            ->orderByDesc('is_premium')
            ->orderByDesc('created_at');

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
        if ($request->filled('skill_ids')) {
            $skillIds = (array) $request->skill_ids;
            $query->whereHas('skills', fn ($q) => $q->whereIn('skills.id', $skillIds));
        }

        return Inertia::render('offers/index', [
            'offers' => $query->paginate(15)->withQueryString(),
            'skills' => Skill::orderBy('name')->get(['id', 'name', 'slug']),
            'filters' => $request->only(['type', 'city', 'remote', 'level', 'skill_ids']),
        ]);
    }

    public function show(Offer $offer): Response
    {
        $offer->load(['company', 'skills', 'applications']);

        return Inertia::render('offers/show', [
            'offer' => $offer,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('offers/create', [
            'skills' => Skill::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(StoreOfferRequest $request)
    {
        $data = $request->validated();
        $skillIds = $data['skill_ids'] ?? [];
        $isRequired = $data['is_required'] ?? [];
        unset($data['skill_ids'], $data['is_required']);

        $data['company_id'] = $request->user()->companyProfile->id;

        $offer = Offer::create($data);

        $syncData = [];
        foreach ($skillIds as $index => $skillId) {
            $syncData[$skillId] = ['is_required' => $isRequired[$index] ?? true];
        }
        $offer->skills()->sync($syncData);

        return redirect()->route('offers.show', $offer)
            ->with('success', 'Offer created successfully.');
    }

    public function edit(Offer $offer): Response
    {
        $this->authorize('update', $offer);

        return Inertia::render('offers/edit', [
            'offer' => $offer->load('skills'),
            'skills' => Skill::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(StoreOfferRequest $request, Offer $offer)
    {
        $this->authorize('update', $offer);

        $data = $request->validated();
        $skillIds = $data['skill_ids'] ?? [];
        $isRequired = $data['is_required'] ?? [];
        unset($data['skill_ids'], $data['is_required']);

        $offer->update($data);

        $syncData = [];
        foreach ($skillIds as $index => $skillId) {
            $syncData[$skillId] = ['is_required' => $isRequired[$index] ?? true];
        }
        $offer->skills()->sync($syncData);

        return redirect()->route('offers.show', $offer)
            ->with('success', 'Offer updated successfully.');
    }

    public function destroy(Offer $offer)
    {
        $this->authorize('delete', $offer);
        $offer->delete();

        return redirect()->route('company.offers')
            ->with('success', 'Offer deleted successfully.');
    }

    public function pause(Offer $offer)
    {
        $this->authorize('pause', $offer);
        $offer->update(['status' => 'paused']);

        return back()->with('success', 'Offer paused.');
    }

    public function reopen(Offer $offer)
    {
        $this->authorize('pause', $offer);
        $offer->update(['status' => 'active']);

        return back()->with('success', 'Offer reopened.');
    }

    public function companyOffers(Request $request): Response
    {
        $company = $request->user()->companyProfile;

        return Inertia::render('company/offers', [
            'offers' => Offer::with('skills')
                ->where('company_id', $company->id)
                ->orderByDesc('created_at')
                ->paginate(15),
        ]);
    }
}
