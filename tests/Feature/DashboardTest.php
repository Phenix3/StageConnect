<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    // Admin has no profile requirement, so it passes EnsureProfileComplete
    $user = User::factory()->create(['role' => 'admin']);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('student without profile is redirected to profile setup', function () {
    $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('student.profile.edit'));
});

test('company without profile is redirected to profile setup', function () {
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('company.profile.edit'));
});
