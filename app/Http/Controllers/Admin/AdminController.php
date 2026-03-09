<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => User::count(),
                'students' => User::where('role', 'student')->count(),
                'companies' => User::where('role', 'company')->count(),
                'offers' => Offer::count(),
                'active_offers' => Offer::where('status', 'active')->count(),
                'applications' => Application::count(),
                'verified_companies' => CompanyProfile::where('verified', true)->count(),
                'pending_companies' => CompanyProfile::where('verified', false)->count(),
            ],
        ]);
    }

    public function users(Request $request): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::orderByDesc('created_at')
                ->paginate(20)
                ->through(fn ($u) => [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'email_verified_at' => $u->email_verified_at,
                    'created_at' => $u->created_at,
                ]),
        ]);
    }

    public function companies(Request $request): Response
    {
        return Inertia::render('admin/companies', [
            'companies' => CompanyProfile::with('user')
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function verifyCompany(CompanyProfile $company)
    {
        $company->update(['verified' => ! $company->verified]);

        return back()->with('success', $company->verified
            ? "Company \"{$company->name}\" verified."
            : "Company \"{$company->name}\" unverified.");
    }
}
