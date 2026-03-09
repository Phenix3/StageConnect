<?php

use App\Models\User;

test('company can view profile setup page', function () {
    $this->withoutVite();
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/company/profile/edit');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('company/profile-setup'));
});

test('company can update their profile', function () {
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->post('/company/profile', [
        'name' => 'Test Company',
        'sector' => 'Technology',
        'size' => '11-50',
        'description' => 'A test company.',
        'website' => 'https://test.com',
    ]);

    $response->assertRedirect('/company/profile/edit');
    $this->assertDatabaseHas('company_profiles', [
        'user_id' => $user->id,
        'name' => 'Test Company',
    ]);
});

test('student cannot access company profile routes', function () {
    $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/company/profile/edit');

    $response->assertStatus(403);
});
