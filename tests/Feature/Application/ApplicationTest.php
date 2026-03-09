<?php

use App\Models\Application;
use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\StudentProfile;
use App\Models\User;

function makeApplicant(): array
{
    $student = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    $profile = StudentProfile::create(['user_id' => $student->id]);
    $companyUser = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    $company = CompanyProfile::create(['user_id' => $companyUser->id, 'name' => 'Test Corp']);
    $offer = Offer::create([
        'company_id' => $company->id,
        'title' => 'Test Offer',
        'description' => 'Desc',
        'type' => 'stage',
        'status' => 'active',
    ]);
    return compact('student', 'profile', 'companyUser', 'company', 'offer');
}

test('student can apply to an offer', function () {
    $data = makeApplicant();

    $response = $this->actingAs($data['student'])->post("/offers/{$data['offer']->id}/apply", [
        'cover_letter' => 'I am interested in this position.',
    ]);

    $response->assertRedirect('/student/applications');
    $this->assertDatabaseHas('applications', [
        'offer_id' => $data['offer']->id,
        'student_id' => $data['profile']->id,
    ]);
});

test('student cannot apply twice to the same offer', function () {
    $data = makeApplicant();

    Application::create([
        'offer_id' => $data['offer']->id,
        'student_id' => $data['profile']->id,
    ]);

    $response = $this->actingAs($data['student'])->post("/offers/{$data['offer']->id}/apply");

    $response->assertSessionHasErrors('offer');
});

test('company can accept an application', function () {
    $data = makeApplicant();
    $application = Application::create([
        'offer_id' => $data['offer']->id,
        'student_id' => $data['profile']->id,
    ]);

    $response = $this->actingAs($data['companyUser'])->patch("/applications/{$application->id}/accept");

    $response->assertRedirect();
    $this->assertDatabaseHas('applications', ['id' => $application->id, 'status' => 'accepted']);
});

test('student can withdraw their application', function () {
    $data = makeApplicant();
    $application = Application::create([
        'offer_id' => $data['offer']->id,
        'student_id' => $data['profile']->id,
    ]);

    $response = $this->actingAs($data['student'])->patch("/applications/{$application->id}/withdraw");

    $response->assertRedirect();
    $this->assertDatabaseHas('applications', ['id' => $application->id, 'status' => 'withdrawn']);
});
