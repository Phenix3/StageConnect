<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionPlan
{
    private const PLAN_LIMITS = [
        'free' => 1,
        'starter' => 5,
        'pro' => PHP_INT_MAX,
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user?->isCompany()) {
            return $next($request);
        }

        $company = $user->companyProfile;

        if (! $company) {
            return $next($request);
        }

        $plan = $company->plan ?? 'free';
        $limit = self::PLAN_LIMITS[$plan] ?? 1;
        $currentCount = $company->offers()->whereIn('status', ['active', 'paused'])->count();

        if ($currentCount >= $limit) {
            return back()->withErrors(['plan' => "Your {$plan} plan allows a maximum of {$limit} active offer(s). Please upgrade your plan."]);
        }

        return $next($request);
    }
}
