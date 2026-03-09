<?php

namespace App\Jobs;

use App\Mail\SubscriptionReceipt;
use App\Models\Subscription;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class GenerateSubscriptionReceipt implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Subscription $subscription,
    ) {}

    public function handle(): void
    {
        $subscription = $this->subscription->load('company.user');

        // Generate PDF
        $pdf = Pdf::loadView('pdf.subscription-receipt', [
            'subscription' => $subscription,
            'company' => $subscription->company,
        ]);

        $filename = 'receipts/receipt-' . $subscription->id . '-' . time() . '.pdf';
        Storage::disk('local')->put($filename, $pdf->output());

        // Send email
        $user = $subscription->company->user;
        if ($user?->email) {
            Mail::to($user->email)->send(new SubscriptionReceipt($subscription, $filename));
        }
    }
}
