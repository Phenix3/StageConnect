<?php

namespace App\Http\Controllers\Message;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Application $application, Request $request): Response
    {
        $user = $request->user();

        // Authorize: user must be the student or the company owner
        $isStudent = $user->isStudent() && $user->studentProfile?->id === $application->student_id;
        $isCompany = $user->isCompany() && $user->companyProfile?->id === $application->offer->company_id;

        if (! $isStudent && ! $isCompany) {
            abort(403);
        }

        // Mark messages from the other party as read
        Message::where('application_id', $application->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('messages/thread', [
            'application' => $application->load(['offer.company', 'student.user']),
            'messages' => $application->messages()->with('sender')->orderBy('created_at')->get(),
        ]);
    }

    public function store(Application $application, Request $request)
    {
        $user = $request->user();

        $isStudent = $user->isStudent() && $user->studentProfile?->id === $application->student_id;
        $isCompany = $user->isCompany() && $user->companyProfile?->id === $application->offer->company_id;

        if (! $isStudent && ! $isCompany) {
            abort(403);
        }

        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $application->messages()->create([
            'sender_id' => $user->id,
            'body' => $data['body'],
        ]);

        return back();
    }

    public function markRead(Message $message, Request $request)
    {
        $user = $request->user();
        if ($message->sender_id !== $user->id) {
            $message->update(['read_at' => now()]);
        }

        return response()->noContent();
    }
}
