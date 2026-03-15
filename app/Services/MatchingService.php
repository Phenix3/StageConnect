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
        return $this->calculateScoreDetail($student, $offer)['total'];
    }

    /**
     * Calculate matching score with per-criterion breakdown.
     *
     * @return array{total: float, skills: array, level: array, location: array, languages: array, availability: array}
     */
    public function calculateScoreDetail(StudentProfile $student, Offer $offer): array
    {
        $student->loadMissing('skills');
        $offer->loadMissing('skills');

        $skillScore = $this->skillScore($student, $offer);
        $levelScore = $this->levelScore($student, $offer);
        $locationScore = $this->locationScore($student, $offer);
        $languageScore = $this->languageScore($student, $offer);
        $availabilityScore = $this->availabilityScore($student, $offer);

        $total = round(
            ($skillScore * 0.40) +
            ($levelScore * 0.25) +
            ($locationScore * 0.20) +
            ($languageScore * 0.10) +
            ($availabilityScore * 0.05),
            2
        );

        return [
            'total' => $total,
            'skills' => [
                'earned' => round($skillScore * 0.40, 2),
                'max' => 40.0,
                'raw' => round($skillScore, 1),
                'hint' => $this->skillHint($student, $offer),
            ],
            'level' => [
                'earned' => round($levelScore * 0.25, 2),
                'max' => 25.0,
                'raw' => round($levelScore, 1),
                'hint' => $this->levelHint($student, $offer),
            ],
            'location' => [
                'earned' => round($locationScore * 0.20, 2),
                'max' => 20.0,
                'raw' => round($locationScore, 1),
                'hint' => $this->locationHint($student, $offer),
            ],
            'languages' => [
                'earned' => round($languageScore * 0.10, 2),
                'max' => 10.0,
                'raw' => round($languageScore, 1),
                'hint' => $this->languageHint($student, $offer),
            ],
            'availability' => [
                'earned' => round($availabilityScore * 0.05, 2),
                'max' => 5.0,
                'raw' => round($availabilityScore, 1),
                'hint' => $this->availabilityHint($student, $offer),
            ],
        ];
    }

    public function getRecommendedOffers(StudentProfile $student, int $limit = 10): Collection
    {
        $offers = Offer::with(['company', 'skills'])->active()->get();

        return $offers
            ->map(fn (Offer $offer) => [
                'offer' => $offer,
                'score' => $this->calculateScore($student, $offer),
                'scoreDetail' => $this->calculateScoreDetail($student, $offer),
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

    private function skillHint(StudentProfile $student, Offer $offer): ?string
    {
        $offerSkillIds = $offer->skills->pluck('id');
        if ($offerSkillIds->isEmpty()) {
            return null;
        }

        $studentSkillIds = $student->skills->pluck('id');
        $missing = $offer->skills->whereNotIn('id', $studentSkillIds->all());

        if ($missing->isEmpty()) {
            return null;
        }

        $names = $missing->take(2)->pluck('name')->join(', ');
        $count = $missing->count();

        return "Add {$names}".($count > 2 ? " and {$count} more" : '').' to improve this score.';
    }

    private function levelHint(StudentProfile $student, Offer $offer): ?string
    {
        if (! $offer->level_required || ! $student->level) {
            return 'Add your education level to improve this score.';
        }

        $levels = ['bac' => 0, 'bac+1' => 1, 'bac+2' => 2, 'bac+3' => 3, 'bac+4' => 4, 'bac+5' => 5, 'bac+8' => 8];
        $studentLevel = $levels[$student->level] ?? 0;
        $requiredLevel = $levels[$offer->level_required] ?? 0;

        if ($studentLevel === $requiredLevel) {
            return null;
        }

        return "This offer requires {$offer->level_required}; your current level is {$student->level}.";
    }

    private function locationHint(StudentProfile $student, Offer $offer): ?string
    {
        if ($offer->remote) {
            return null;
        }

        if (! $student->city) {
            return 'Add your city to improve location matching.';
        }

        if (strtolower(trim($student->city)) !== strtolower(trim($offer->city ?? ''))) {
            return "Offer is in {$offer->city}; your city is {$student->city}.";
        }

        return null;
    }

    private function languageHint(StudentProfile $student, Offer $offer): ?string
    {
        $offerLanguages = $offer->languages ?? [];
        if (empty($offerLanguages)) {
            return null;
        }

        $studentLanguages = array_map('strtolower', $student->languages ?? []);
        $missing = array_diff(array_map('strtolower', $offerLanguages), $studentLanguages);

        if (empty($missing)) {
            return null;
        }

        $names = implode(', ', array_slice(array_values($missing), 0, 2));

        return "Add {$names} to your language list.";
    }

    private function availabilityHint(StudentProfile $student, Offer $offer): ?string
    {
        if (! $student->availability_from) {
            return 'Set your availability date to improve this score.';
        }

        if ($offer->expires_at && $student->availability_from->gt($offer->expires_at)) {
            return 'Your availability starts after this offer expires.';
        }

        return null;
    }
}
