<?php

namespace App\Jobs;

use App\Models\Application;
use App\Models\StudentProfile;
use App\Services\MatchingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RecalculateMatchingScores implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $studentProfileId,
    ) {}

    public function handle(MatchingService $matchingService): void
    {
        $student = StudentProfile::with('skills')->find($this->studentProfileId);

        if (! $student) {
            return;
        }

        Application::with(['offer.skills'])
            ->where('student_id', $student->id)
            ->whereIn('status', ['pending', 'viewed'])
            ->each(function (Application $application) use ($matchingService, $student) {
                $score = $matchingService->calculateScore($student, $application->offer);
                $application->update(['matching_score' => $score]);
            });
    }
}
