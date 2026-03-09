<?php

use App\Models\CompanyProfile;
use App\Models\Subscription;
use App\Models\User;
use App\Services\SubscriptionService;

function makeCompanyWithProfile(): array
{
    $user = User::factory()->create(['role' => 'company', 'email_verified_at' => now()]);
    $company = CompanyProfile::create([
        'user_id' => $user->id,
        'name' => 'Test Corp',
        'plan' => 'free',
    ]);
    return compact('user', 'company');
}

test('company can view subscription plans', function () {
    $this->withoutVite();
    $data = makeCompanyWithProfile();

    $response = $this->actingAs($data['user'])->get('/subscription/plans');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('subscription/plans'));
});

test('student cannot access subscription plans', function () {
    $user = User::factory()->create(['role' => 'student', 'email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/subscription/plans');

    $response->assertStatus(403);
});

test('company can initiate cinetpay checkout', function () {
    $data = makeCompanyWithProfile();

    $response = $this->actingAs($data['user'])->post('/subscription/checkout', [
        'plan' => 'starter',
        'provider' => 'cinetpay',
    ]);

    $response->assertRedirect('/subscription/success');
    $this->assertDatabaseHas('subscriptions', [
        'company_id' => $data['company']->id,
        'plan' => 'starter',
        'provider' => 'cinetpay',
        'status' => 'pending',
    ]);
});

test('company can initiate stripe checkout', function () {
    $data = makeCompanyWithProfile();

    $response = $this->actingAs($data['user'])->post('/subscription/checkout', [
        'plan' => 'pro',
        'provider' => 'stripe',
    ]);

    $response->assertRedirect('/subscription/success');
    $this->assertDatabaseHas('subscriptions', [
        'company_id' => $data['company']->id,
        'plan' => 'pro',
        'provider' => 'stripe',
    ]);
});

test('cinetpay webhook activates subscription', function () {
    $data = makeCompanyWithProfile();
    $service = new SubscriptionService();
    $checkoutData = $service->initiateCinetPayCheckout($data['company'], 'starter');

    $response = $this->post('/webhooks/cinetpay', [
        'cpm_trans_id' => $checkoutData['transaction_id'],
        'cpm_result' => '00',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('subscriptions', [
        'transaction_id' => $checkoutData['transaction_id'],
        'status' => 'active',
    ]);
    $this->assertDatabaseHas('company_profiles', [
        'id' => $data['company']->id,
        'plan' => 'starter',
    ]);
});

test('failed cinetpay webhook cancels subscription', function () {
    $data = makeCompanyWithProfile();
    $service = new SubscriptionService();
    $checkoutData = $service->initiateCinetPayCheckout($data['company'], 'starter');

    $this->post('/webhooks/cinetpay', [
        'cpm_trans_id' => $checkoutData['transaction_id'],
        'cpm_result' => '01', // failure
    ]);

    $this->assertDatabaseHas('subscriptions', [
        'transaction_id' => $checkoutData['transaction_id'],
        'status' => 'cancelled',
    ]);
});
