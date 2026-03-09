<?php

namespace App\Services;

use App\Models\Offer;
use App\Models\StudentProfile;
use Illuminate\Support\Collection;

class MatchingService
{
    /**
     * Calculate matching score between a student and an offer.
     * Returns a float between 0 and 100.
     *
     * Criteria weights:
     * - Skills match: 40%
     * - Level match: 25%
     * - Location match: 20%
     * - Languages match: 10%
     * - Availability match: 5%
     */
    public function calculateScore(StudentProfile $student, Offer $offer): float
    {
        $student->loadMissing('skills');
        $offer->loadMissing('skills');

        $skillScore = $this->skillScore($student, $offer);
        $levelScore = $this->levelScore($student, $offer);
        $locationScore = $this->locationScore($student, $offer);
        $languageScore = $this->languageScore($student, $offer);
        $availabilityScore = $this->availabilityScore($student, $offer);

        return round(
            ($skillScore * 0.40) +
            ($levelScore * 0.25) +
            ($locationScore * 0.20) +
            ($languageScore * 0.10) +
            ($availabilityScore * 0.05),
            2
        );
    }

    public function getRecommendedOffers(StudentProfile $student, int $limit = 10): Collection
    {
        $offers = Offer::with(['company', 'skills'])->active()->get();

        return $offers
            ->map(fn (Offer $offer) => [
                'offer' => $offer,
                'score' => $this->calculateScore($student, $offer),
            ])
            ->sortByDesc('score')
            ->take($limit)
            ->values();
    }

    private function skillScore(StudentProfile $student, Offer $offer): float
    {
        $offerSkillIds = $offer->skills->pluck('id');
        if ($offerSkillIds->isEmpty()) {
            return 100.0;
        }

        $studentSkillIds = $student->skills->pluck('id');
        $requiredSkillIds = $offer->skills->where('pivot.is_required', true)->pluck('id');

        if ($requiredSkillIds->isEmpty()) {
            $matched = $offerSkillIds->intersect($studentSkillIds)->count();

            return ($matched / $offerSkillIds->count()) * 100;
        }

        $matchedRequired = $requiredSkillIds->intersect($studentSkillIds)->count();

        return ($matchedRequired / $requiredSkillIds->count()) * 100;
    }

    private function levelScore(StudentProfile $student, Offer $offer): float
    {
        if (! $offer->level_required || ! $student->level) {
            return 50.0; // neutral if no requirement
        }

        $levels = ['bac' => 0, 'bac+1' => 1, 'bac+2' => 2, 'bac+3' => 3, 'bac+4' => 4, 'bac+5' => 5, 'bac+8' => 8];
        $studentLevel = $levels[$student->level] ?? 0;
        $requiredLevel = $levels[$offer->level_required] ?? 0;

        if ($studentLevel === $requiredLevel) {
            return 100.0;
        }

        $diff = abs($studentLevel - $requiredLevel);

        return match (true) {
            $diff === 1 => 75.0,
            $diff === 2 => 50.0,
            default => 25.0,
        };
    }

    private function locationScore(StudentProfile $student, Offer $offer): float
    {
        if ($offer->remote) {
            return 100.0;
        }

        if (! $student->city || ! $offer->city) {
            return 50.0;
        }

        return strtolower(trim($student->city)) === strtolower(trim($offer->city))
            ? 100.0
            : 20.0;
    }

    private function languageScore(StudentProfile $student, Offer $offer): float
    {
        $offerLanguages = $offer->languages ?? [];
        if (empty($offerLanguages)) {
            return 100.0;
        }

        $studentLanguages = array_map('strtolower', $student->languages ?? []);
        $offerLanguages = array_map('strtolower', $offerLanguages);

        $matched = count(array_intersect($studentLanguages, $offerLanguages));

        return ($matched / count($offerLanguages)) * 100;
    }

    private function availabilityScore(StudentProfile $student, Offer $offer): float
    {
        if (! $student->availability_from) {
            return 50.0;
        }

        if (! $offer->expires_at) {
            return 75.0;
        }

        // Student available before offer expires
        if ($student->availability_from->lte($offer->expires_at)) {
            return 100.0;
        }

        return 0.0;
    }
}
