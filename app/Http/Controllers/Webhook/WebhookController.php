<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class WebhookController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    public function cinetpay(Request $request): Response
    {
        $data = $request->all();

        // In production: validate CinetPay signature here
        $this->subscriptionService->handleCinetPayWebhook($data);

        return response('OK', 200);
    }

    public function stripe(Request $request): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        if (! $secret) {
            \Illuminate\Support\Facades\Log::warning('Stripe webhook called but no webhook secret configured.');

            return response('Webhook secret not configured.', 400);
        }

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('Signature verification failed.', 400);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload.', 400);
        }

        $this->subscriptionService->handleStripeWebhook($event->toArray());

        return response('OK', 200);
    }
}
