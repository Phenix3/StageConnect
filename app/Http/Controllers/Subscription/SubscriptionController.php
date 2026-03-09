<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubscriptionController extends Controller
{
    public const PLANS = [
        'free' => [
            'name' => 'Free',
            'price' => 0,
            'currency' => '€',
            'max_offers' => 1,
            'features' => [
                '1 active offer',
                'Basic company profile',
                'Email support',
            ],
        ],
        'starter' => [
            'name' => 'Starter',
            'price' => 29,
            'currency' => '€',
            'max_offers' => 5,
            'features' => [
                '5 active offers',
                'Featured company profile',
                'Priority email support',
                'Application analytics',
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'price' => 99,
            'currency' => '€',
            'max_offers' => PHP_INT_MAX,
            'features' => [
                'Unlimited active offers',
                'Premium listing (highlighted)',
                'Dedicated account manager',
                'Advanced analytics',
                'API access',
            ],
        ],
    ];

    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    public function plans(Request $request): Response
    {
        $company = $request->user()->companyProfile;

        return Inertia::render('subscription/plans', [
            'plans' => self::PLANS,
            'current' => $company?->plan ?? 'free',
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'plan' => ['required', 'in:starter,pro'],
            'provider' => ['required', 'in:cinetpay,stripe'],
        ]);

        $company = $request->user()->companyProfile;

        if (! $company) {
            return back()->withErrors(['company' => 'Please complete your company profile first.']);
        }

        $provider = $request->input('provider');
        $plan = $request->input('plan');

        if ($provider === 'stripe') {
            $checkoutData = $this->subscriptionService->initiateStripeCheckout($company, $plan);
        } else {
            $checkoutData = $this->subscriptionService->initiateCinetPayCheckout($company, $plan);
        }

        // In a real scenario, redirect to payment URL
        // For now, redirect to success with the transaction ID
        return redirect()->route('subscription.success')
            ->with('checkout', $checkoutData);
    }

    public function success(): Response
    {
        return Inertia::render('subscription/success', [
            'checkout' => session('checkout'),
        ]);
    }
}
