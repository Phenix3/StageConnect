<?php

namespace App\Services;

use App\Jobs\GenerateSubscriptionReceipt;
use App\Models\CompanyProfile;
use App\Models\Subscription;

class SubscriptionService
{
    private const PLAN_PRICES = [
        'free' => 0,
        'starter' => 29,
        'pro' => 99,
    ];

    public function getPlanPrice(string $plan): int
    {
        return self::PLAN_PRICES[$plan] ?? 0;
    }

    public function initiateCinetPayCheckout(CompanyProfile $company, string $plan): array
    {
        $price = $this->getPlanPrice($plan);
        $transactionId = 'SC-' . strtoupper($plan) . '-' . $company->id . '-' . time();

        $subscription = Subscription::create([
            'company_id' => $company->id,
            'plan' => $plan,
            'price' => $price,
            'transaction_id' => $transactionId,
            'provider' => 'cinetpay',
            'status' => 'pending',
        ]);

        // CinetPay API call would go here in production
        // Return the parameters that would be sent to CinetPay
        return [
            'subscription_id' => $subscription->id,
            'transaction_id' => $transactionId,
            'amount' => $price * 100, // in cents
            'currency' => 'XOF',
            'plan' => $plan,
            'notify_url' => url('/webhooks/cinetpay'),
            'return_url' => url('/subscription/success'),
        ];
    }

    public function initiateStripeCheckout(CompanyProfile $company, string $plan): array
    {
        $price = $this->getPlanPrice($plan);
        $transactionId = 'SC-STRIPE-' . strtoupper($plan) . '-' . $company->id . '-' . time();

        $subscription = Subscription::create([
            'company_id' => $company->id,
            'plan' => $plan,
            'price' => $price,
            'transaction_id' => $transactionId,
            'provider' => 'stripe',
            'status' => 'pending',
        ]);

        return [
            'subscription_id' => $subscription->id,
            'transaction_id' => $transactionId,
            'amount' => $price * 100,
            'currency' => 'eur',
            'plan' => $plan,
        ];
    }

    public function handleCinetPayWebhook(array $data): void
    {
        $transactionId = $data['cpm_trans_id'] ?? null;

        if (! $transactionId) {
            return;
        }

        $subscription = Subscription::where('transaction_id', $transactionId)->first();

        if (! $subscription) {
            return;
        }

        $status = $data['cpm_result'] ?? null;

        if ($status === '00') {
            // Payment successful
            $subscription->update([
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addYear(),
            ]);

            $subscription->company->update(['plan' => $subscription->plan]);

            dispatch(new GenerateSubscriptionReceipt($subscription));
        } else {
            $subscription->update(['status' => 'cancelled']);
        }
    }

    public function handleStripeWebhook(array $data): void
    {
        $eventType = $data['type'] ?? null;

        if ($eventType === 'checkout.session.completed') {
            $sessionData = $data['data']['object'] ?? [];
            $transactionId = $sessionData['metadata']['transaction_id'] ?? null;

            if (! $transactionId) {
                return;
            }

            $subscription = Subscription::where('transaction_id', $transactionId)->first();

            if (! $subscription) {
                return;
            }

            $subscription->update([
                'status' => 'active',
                'starts_at' => now(),
                'ends_at' => now()->addYear(),
            ]);

            $subscription->company->update(['plan' => $subscription->plan]);

            dispatch(new GenerateSubscriptionReceipt($subscription));
        }
    }
}
