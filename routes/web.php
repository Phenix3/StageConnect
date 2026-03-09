<?php

use App\Http\Controllers\Application\ApplicationController;
use App\Http\Controllers\Company\CompanyProfileController;
use App\Http\Controllers\Matching\MatchingController;
use App\Http\Controllers\Message\MessageController;
use App\Http\Controllers\Offer\OfferController;
use App\Http\Controllers\Review\ReviewController;
use App\Http\Controllers\Student\StudentProfileController;
use App\Http\Controllers\Subscription\SubscriptionController;
use App\Http\Controllers\Webhook\WebhookController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Webhook routes (no auth middleware)
Route::post('webhooks/cinetpay', [WebhookController::class, 'cinetpay'])->name('webhooks.cinetpay');
Route::post('webhooks/stripe', [WebhookController::class, 'stripe'])->name('webhooks.stripe');

// Public routes
Route::get('offers', [OfferController::class, 'index'])->name('offers.index');
// 'offers/recommended' must be registered BEFORE the wildcard route to avoid being swallowed.
Route::get('offers/recommended', [MatchingController::class, 'recommended'])
    ->middleware(['auth', 'verified', 'role:student'])
    ->name('offers.recommended');
Route::get('offers/{offer}', [OfferController::class, 'show'])->name('offers.show');
Route::get('companies/{id}', [CompanyProfileController::class, 'show'])->name('company.profile.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Student routes
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::get('profile/edit', [StudentProfileController::class, 'edit'])->name('profile.edit');
        Route::post('profile', [StudentProfileController::class, 'update'])->name('profile.update');
        Route::get('applications', [ApplicationController::class, 'studentIndex'])->name('applications');
    });

    // Subscription routes (company only)
    Route::middleware('role:company')->prefix('subscription')->name('subscription.')->group(function () {
        Route::get('plans', [SubscriptionController::class, 'plans'])->name('plans');
        Route::post('checkout', [SubscriptionController::class, 'checkout'])->name('checkout');
        Route::get('success', [SubscriptionController::class, 'success'])->name('success');
    });

    // Company routes
    Route::middleware('role:company')->prefix('company')->name('company.')->group(function () {
        Route::get('profile/edit', [CompanyProfileController::class, 'edit'])->name('profile.edit');
        Route::post('profile', [CompanyProfileController::class, 'update'])->name('profile.update');
        Route::get('offers', [OfferController::class, 'companyOffers'])->name('offers');
        Route::get('applications', [ApplicationController::class, 'companyIndex'])->name('applications');
    });

    // Offer management (company only)
    Route::middleware('role:company')->group(function () {
        Route::get('offers/create', [OfferController::class, 'create'])->name('offers.create');
        Route::post('offers', [OfferController::class, 'store'])
            ->middleware('subscription.plan')
            ->name('offers.store');
        Route::get('offers/{offer}/edit', [OfferController::class, 'edit'])->name('offers.edit');
        Route::put('offers/{offer}', [OfferController::class, 'update'])->name('offers.update');
        Route::delete('offers/{offer}', [OfferController::class, 'destroy'])->name('offers.destroy');
        Route::patch('offers/{offer}/pause', [OfferController::class, 'pause'])->name('offers.pause');
        Route::patch('offers/{offer}/reopen', [OfferController::class, 'reopen'])->name('offers.reopen');
    });

    // Applications (student only)
    Route::middleware('role:student')->group(function () {
        Route::post('offers/{offer}/apply', [ApplicationController::class, 'store'])->name('applications.store');
        Route::patch('applications/{application}/withdraw', [ApplicationController::class, 'withdraw'])->name('applications.withdraw');
    });

    // Applications (company only)
    Route::middleware('role:company')->group(function () {
        Route::patch('applications/{application}/accept', [ApplicationController::class, 'accept'])->name('applications.accept');
        Route::patch('applications/{application}/reject', [ApplicationController::class, 'reject'])->name('applications.reject');
    });

    // Messages (any auth user)
    Route::get('applications/{application}/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::post('applications/{application}/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::patch('messages/{message}/read', [MessageController::class, 'markRead'])->name('messages.mark-read');

    // Reviews (any auth user)
    Route::get('applications/{application}/review', [ReviewController::class, 'createForm'])->name('reviews.create');
    Route::post('applications/{application}/review', [ReviewController::class, 'store'])->name('reviews.store');
});

require __DIR__.'/settings.php';
