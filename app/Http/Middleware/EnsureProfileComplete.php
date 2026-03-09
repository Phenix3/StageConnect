<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileComplete
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->isStudent() && ! $user->studentProfile) {
            return redirect()->route('student.profile.edit');
        }

        if ($user->isCompany() && ! $user->companyProfile) {
            return redirect()->route('company.profile.edit');
        }

        return $next($request);
    }
}
