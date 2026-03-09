<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $profile = $request->user()->studentProfile;

        return Inertia::render('student/profile-setup', [
            'profile' => $profile?->load('skills'),
            'skills' => Skill::orderBy('name')->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'bio' => ['nullable', 'string', 'max:1000'],
            'level' => ['nullable', 'in:bac,bac+1,bac+2,bac+3,bac+4,bac+5,bac+8'],
            'school' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'availability_from' => ['nullable', 'date'],
            'availability_to' => ['nullable', 'date', 'after_or_equal:availability_from'],
            'skill_ids' => ['nullable', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
            'cv' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $user = $request->user();

        if ($request->hasFile('cv')) {
            if ($user->studentProfile?->cv_path) {
                Storage::disk('local')->delete($user->studentProfile->cv_path);
            }
            $data['cv_path'] = $request->file('cv')->store('cvs', 'local');
        }

        $skillIds = $data['skill_ids'] ?? [];
        unset($data['skill_ids']);

        $profile = $user->studentProfile()->updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        $profile->skills()->sync($skillIds);

        dispatch(new \App\Jobs\RecalculateMatchingScores($profile->id));

        return redirect()->route('student.profile.edit')
            ->with('success', 'Profile updated successfully.');
    }
}
