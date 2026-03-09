<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('company/profile-setup', [
            'profile' => $request->user()->companyProfile,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sector' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'in:1-10,11-50,51-200,201-500,500+'],
            'description' => ['nullable', 'string', 'max:2000'],
            'website' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'file', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        if ($request->hasFile('logo')) {
            if ($user->companyProfile?->logo) {
                Storage::disk('public')->delete($user->companyProfile->logo);
            }
            $data['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $user->companyProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return redirect()->route('company.profile.edit')
            ->with('success', 'Profile updated successfully.');
    }

    public function show(int $id): Response
    {
        $profile = \App\Models\CompanyProfile::with('user')->findOrFail($id);

        return Inertia::render('company/profile', [
            'company' => $profile,
        ]);
    }
}
