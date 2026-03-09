<?php

use App\Models\Skill;
use App\Models\User;

test('student can view profile setup page', function () {
    $this->withoutVite();
    $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/student/profile/edit');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('student/profile-setup'));
});

test('student can update their profile', function () {
    $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
    $skill = Skill::create(['name' => 'PHP', 'slug' => 'php']);

    $response = $this->actingAs($user)->post('/student/profile', [
        'bio' => 'Test bio',
        'level' => 'bac+3',
        'school' => 'Test University',
        'city' => 'Paris',
        'skill_ids' => [$skill->id],
    ]);

    $response->assertRedirect('/student/profile/edit');
    $this->assertDatabaseHas('student_profiles', [
        'user_id' => $user->id,
        'bio' => 'Test bio',
        'level' => 'bac+3',
    ]);
});

test('company cannot access student profile routes', function () {
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/student/profile/edit');

    $response->assertStatus(403);
});

test('unauthenticated user cannot access student profile routes', function () {
    $response = $this->get('/student/profile/edit');
    $response->assertRedirect('/login');
});
