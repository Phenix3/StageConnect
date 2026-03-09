<?php

use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\User;

test('anyone can list offers via api', function () {
    $response = $this->getJson('/api/v1/offers');

    $response->assertStatus(200)
        ->assertJsonStructure(['data', 'meta']);
});

test('company can create offer via api', function () {
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    CompanyProfile::create(['user_id' => $user->id, 'name' => 'Corp', 'plan' => 'starter']);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withToken($token)->postJson('/api/v1/offers', [
        'title' => 'API Offer',
        'description' => 'Great opportunity.',
        'type' => 'stage',
    ]);

    $response->assertStatus(201)->assertJsonPath('title', 'API Offer');
});

test('student cannot create offer via api', function () {
    $user = User::factory()->create(['role' => 'student']);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withToken($token)->postJson('/api/v1/offers', [
        'title' => 'Test',
        'description' => 'Test',
        'type' => 'stage',
    ]);

    $response->assertStatus(403);
});
