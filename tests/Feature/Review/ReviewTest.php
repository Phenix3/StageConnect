<?php

use App\Models\Application;
use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\StudentProfile;
use App\Models\User;

function makeAcceptedApplication(): array
{
    $student = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    $studentProfile = StudentProfile::create(['user_id' => $student->id]);
    $companyUser = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    $company = CompanyProfile::create(['user_id' => $companyUser->id, 'name' => 'Corp']);
    $offer = Offer::create(['company_id' => $company->id, 'title' => 'Job', 'description' => 'Desc', 'type' => 'stage', 'status' => 'active']);
    $application = Application::withoutEvents(fn () => Application::create([
        'offer_id' => $offer->id,
        'student_id' => $studentProfile->id,
        'status' => 'accepted',
    ]));

    return compact('student', 'studentProfile', 'companyUser', 'company', 'offer', 'application');
}

test('student can leave a review for accepted application', function () {
    $data = makeAcceptedApplication();

    $response = $this->actingAs($data['student'])->post("/applications/{$data['application']->id}/review", [
        'rating' => 5,
        'comment' => 'Great internship!',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('reviews', [
        'application_id' => $data['application']->id,
        'reviewer_id' => $data['student']->id,
        'rating' => 5,
    ]);
});

test('cannot leave review for non-accepted application', function () {
    $data = makeAcceptedApplication();
    $data['application']->update(['status' => 'pending']);

    $response = $this->actingAs($data['student'])->post("/applications/{$data['application']->id}/review", [
        'rating' => 4,
    ]);

    $response->assertStatus(422);
});

test('cannot leave duplicate review', function () {
    $data = makeAcceptedApplication();

    $this->actingAs($data['student'])->post("/applications/{$data['application']->id}/review", [
        'rating' => 5,
    ]);

    $response = $this->actingAs($data['student'])->post("/applications/{$data['application']->id}/review", [
        'rating' => 3,
    ]);

    $response->assertSessionHasErrors('review');
});
