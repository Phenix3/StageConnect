<?php

namespace App\Jobs;

use App\Mail\ApplicationReceived;
use App\Models\Application;
use App\Notifications\NewApplicationReceived;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendApplicationNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Application $application,
    ) {}

    public function handle(): void
    {
        $application = $this->application->load('offer.company.user', 'student.user');

        $companyUser = $application->offer->company->user;

        if ($companyUser?->email) {
            \Illuminate\Support\Facades\Mail::to($companyUser->email)
                ->send(new ApplicationReceived($application));
        }

        if ($companyUser) {
            $companyUser->notify(new NewApplicationReceived($application));
        }
    }
}
