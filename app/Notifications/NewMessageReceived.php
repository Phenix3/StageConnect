<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewMessageReceived extends Notification
{
    use Queueable;

    public function __construct(private readonly Message $message) {}

    public function via(): array
    {
        return ['database'];
    }

    public function toDatabase(): array
    {
        return [
            'type' => 'new_message',
            'sender_name' => $this->message->sender->name ?? '',
            'application_id' => $this->message->application_id,
        ];
    }
}
