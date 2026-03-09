<?php

use App\Models\Application;
use App\Models\CompanyProfile;
use App\Models\Message;
use App\Models\Offer;
use App\Models\StudentProfile;
use App\Models\User;

function makeThread(): array
{
    $student = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    $studentProfile = StudentProfile::create(['user_id' => $student->id]);
    $companyUser = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    $company = CompanyProfile::create(['user_id' => $companyUser->id, 'name' => 'Corp']);
    $offer = Offer::create(['company_id' => $company->id, 'title' => 'Job', 'description' => 'Desc', 'type' => 'stage', 'status' => 'active']);
    $application = Application::withoutEvents(fn () => Application::create([
        'offer_id' => $offer->id,
        'student_id' => $studentProfile->id,
    ]));

    return compact('student', 'studentProfile', 'companyUser', 'company', 'offer', 'application');
}

test('student can view message thread', function () {
    $this->withoutVite();
    $data = makeThread();

    $response = $this->actingAs($data['student'])->get("/applications/{$data['application']->id}/messages");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('messages/thread'));
});

test('student can send a message', function () {
    $data = makeThread();

    $response = $this->actingAs($data['student'])->post("/applications/{$data['application']->id}/messages", [
        'body' => 'Hello from student!',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('messages', [
        'application_id' => $data['application']->id,
        'sender_id' => $data['student']->id,
        'body' => 'Hello from student!',
    ]);
});

test('company can send a message', function () {
    $data = makeThread();

    $response = $this->actingAs($data['companyUser'])->post("/applications/{$data['application']->id}/messages", [
        'body' => 'Hello from company!',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('messages', ['body' => 'Hello from company!']);
});

test('unauthorized user cannot view messages', function () {
    $data = makeThread();
    $other = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    StudentProfile::create(['user_id' => $other->id]);

    $response = $this->actingAs($other)->get("/applications/{$data['application']->id}/messages");

    $response->assertStatus(403);
});
