<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationStatusChanged extends Notification
{
    use Queueable;

    public function __construct(private readonly Application $application) {}

    public function via(): array
    {
        return ['database'];
    }

    public function toDatabase(): array
    {
        return [
            'type' => 'status_changed',
            'offer_title' => $this->application->offer->title ?? '',
            'new_status' => $this->application->status,
            'application_id' => $this->application->id,
        ];
    }
}
