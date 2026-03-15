<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()->companyProfile;

        $offers = $company->offers()
            ->withCount('applications')
            ->with(['applications:id,offer_id,matching_score,status'])
            ->orderByDesc('created_at')
            ->get();

        $offerStats = $offers->map(function ($offer) {
            $applications = $offer->applications;
            $total = $applications->count();
            $avgScore = $total > 0 ? round($applications->avg('matching_score'), 1) : null;

            return [
                'id' => $offer->id,
                'title' => $offer->title,
                'status' => $offer->status,
                'views_count' => $offer->views_count,
                'applications_count' => $total,
                'avg_matching_score' => $avgScore,
                'funnel' => [
                    'pending' => $applications->where('status', 'pending')->count(),
                    'accepted' => $applications->where('status', 'accepted')->count(),
                    'rejected' => $applications->where('status', 'rejected')->count(),
                    'withdrawn' => $applications->where('status', 'withdrawn')->count(),
                ],
            ];
        });

        $totalViews = $offerStats->sum('views_count');
        $totalApplications = $offerStats->sum('applications_count');
        $conversionRate = $totalViews > 0
            ? round(($totalApplications / $totalViews) * 100, 1)
            : 0;
        $overallAvgScore = $offerStats->whereNotNull('avg_matching_score')->avg('avg_matching_score');

        return Inertia::render('company/analytics', [
            'offerStats' => $offerStats,
            'summary' => [
                'total_views' => $totalViews,
                'total_applications' => $totalApplications,
                'conversion_rate' => $conversionRate,
                'avg_matching_score' => $overallAvgScore ? round($overallAvgScore, 1) : null,
                'total_offers' => $offers->count(),
                'active_offers' => $offers->where('status', 'active')->count(),
            ],
        ]);
    }
}
