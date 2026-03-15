<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewApplicationReceived extends Notification
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
            'type' => 'new_application',
            'offer_title' => $this->application->offer->title ?? '',
            'student_name' => $this->application->student->user->name ?? '',
            'application_id' => $this->application->id,
        ];
    }
}
