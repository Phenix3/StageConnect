<?php

namespace App\Http\Controllers\Application;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicationRequest;
use App\Mail\ApplicationStatusChanged;
use App\Models\Application;
use App\Models\Offer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function store(StoreApplicationRequest $request, Offer $offer)
    {
        $student = $request->user()->studentProfile;

        $existing = Application::where('offer_id', $offer->id)
            ->where('student_id', $student->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['offer' => 'You have already applied to this offer.']);
        }

        Application::create([
            'offer_id' => $offer->id,
            'student_id' => $student->id,
            'cover_letter' => $request->validated()['cover_letter'] ?? null,
        ]);

        return redirect()->route('student.applications')
            ->with('success', 'Application submitted successfully.');
    }

    public function studentIndex(Request $request): Response
    {
        $student = $request->user()->studentProfile;

        return Inertia::render('applications/student-index', [
            'applications' => Application::with(['offer.company'])
                ->where('student_id', $student->id)
                ->orderByDesc('applied_at')
                ->paginate(15),
        ]);
    }

    public function companyIndex(Request $request): Response
    {
        $company = $request->user()->companyProfile;

        return Inertia::render('applications/company-index', [
            'applications' => Application::with(['offer', 'student.user'])
                ->whereHas('offer', fn ($q) => $q->where('company_id', $company->id))
                ->orderByDesc('applied_at')
                ->paginate(15),
        ]);
    }

    public function accept(Application $application, Request $request)
    {
        $this->authorize('accept', $application);

        $application->update(['status' => 'accepted']);

        $studentUser = $application->student->user;
        if ($studentUser?->email) {
            Mail::to($studentUser->email)->send(new ApplicationStatusChanged($application));
        }

        return back()->with('success', 'Application accepted.');
    }

    public function reject(Application $application, Request $request)
    {
        $this->authorize('reject', $application);

        $application->update(['status' => 'rejected']);

        $studentUser = $application->student->user;
        if ($studentUser?->email) {
            Mail::to($studentUser->email)->send(new ApplicationStatusChanged($application));
        }

        return back()->with('success', 'Application rejected.');
    }

    public function withdraw(Application $application, Request $request)
    {
        $this->authorize('withdraw', $application);

        $application->update(['status' => 'withdrawn']);

        return back()->with('success', 'Application withdrawn.');
    }
}
