<?php

use App\Models\User;

test('user can register via api', function () {
    $response = $this->postJson('/api/v1/auth/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'student',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure(['user', 'token']);
});

test('user can login via api', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
        'role' => 'student',
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure(['user', 'token']);
});

test('user can logout via api', function () {
    $user = User::factory()->create(['role' => 'student']);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withToken($token)->postJson('/api/v1/auth/logout');

    $response->assertStatus(200);
});

test('api returns me endpoint data', function () {
    $user = User::factory()->create(['role' => 'student']);
    $token = $user->createToken('test')->plainTextToken;

    $response = $this->withToken($token)->getJson('/api/v1/auth/me');

    $response->assertStatus(200)
        ->assertJsonPath('role', 'student');
});

test('invalid credentials return 422', function () {
    $response = $this->postJson('/api/v1/auth/login', [
        'email' => 'nobody@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422);
});
