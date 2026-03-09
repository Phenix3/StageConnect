<?php

use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\Skill;
use App\Models\User;

function makeCompanyUser(): User
{
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    CompanyProfile::create([
        'user_id' => $user->id,
        'name' => 'Test Corp',
        'plan' => 'starter',
    ]);
    return $user;
}

function makeStudentUser(): User
{
    return User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);
}

test('anyone can view offers index', function () {
    $this->withoutVite();
    $response = $this->get('/offers');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('offers/index'));
});

test('company can create an offer', function () {
    $user = makeCompanyUser();
    $skill = Skill::create(['name' => 'PHP', 'slug' => 'php']);

    $response = $this->actingAs($user)->post('/offers', [
        'title' => 'Test Internship',
        'description' => 'A great internship opportunity.',
        'type' => 'stage',
        'city' => 'Paris',
        'remote' => false,
        'skill_ids' => [$skill->id],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('offers', ['title' => 'Test Internship']);
});

test('student cannot create an offer', function () {
    $user = makeStudentUser();

    $response = $this->actingAs($user)->post('/offers', [
        'title' => 'Test',
        'description' => 'Test',
        'type' => 'stage',
    ]);

    $response->assertStatus(403);
});

test('company can update their own offer', function () {
    $user = makeCompanyUser();
    $offer = Offer::create([
        'company_id' => $user->companyProfile->id,
        'title' => 'Old Title',
        'description' => 'Description',
        'type' => 'stage',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->put("/offers/{$offer->id}", [
        'title' => 'New Title',
        'description' => 'New Description',
        'type' => 'stage',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('offers', ['title' => 'New Title']);
});

test('company cannot update another company offer', function () {
    $user1 = makeCompanyUser();
    $user2 = makeCompanyUser();

    $offer = Offer::create([
        'company_id' => $user1->companyProfile->id,
        'title' => 'User1 Offer',
        'description' => 'Description',
        'type' => 'stage',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user2)->put("/offers/{$offer->id}", [
        'title' => 'Hacked',
        'description' => 'Description',
        'type' => 'stage',
    ]);

    $response->assertStatus(403);
});

test('free plan company cannot create more than 1 offer', function () {
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    CompanyProfile::create(['user_id' => $user->id, 'name' => 'Free Corp', 'plan' => 'free']);

    // Create first offer
    Offer::create([
        'company_id' => $user->companyProfile->id,
        'title' => 'Offer 1',
        'description' => 'Desc',
        'type' => 'stage',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->post('/offers', [
        'title' => 'Offer 2',
        'description' => 'Desc',
        'type' => 'stage',
    ]);

    $response->assertSessionHasErrors('plan');
});
