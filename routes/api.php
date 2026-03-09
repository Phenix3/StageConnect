<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Offer\OfferController;
use App\Http\Controllers\Api\V1\Application\ApplicationController;
use App\Http\Controllers\Api\V1\Profile\StudentProfileController;
use App\Http\Controllers\Api\V1\Profile\CompanyProfileController;
use App\Http\Controllers\Api\V1\Matching\MatchingController;
use App\Http\Controllers\Api\V1\Message\MessageController;
use App\Http\Controllers\Api\V1\Review\ReviewController;
use App\Http\Controllers\Api\V1\Skill\SkillController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    // Auth (public)
    Route::post('auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');

    // Public routes
    Route::get('offers', [OfferController::class, 'index'])->name('offers.index');
    Route::get('offers/{offer}', [OfferController::class, 'show'])->name('offers.show');
    Route::get('skills', [SkillController::class, 'index'])->name('skills.index');
    Route::get('companies/{id}', [CompanyProfileController::class, 'show'])->name('companies.show');

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('auth/me', [AuthController::class, 'me'])->name('auth.me');

        // Student profile
        Route::get('student/profile', [StudentProfileController::class, 'show'])->name('student.profile.show');
        Route::put('student/profile', [StudentProfileController::class, 'update'])->name('student.profile.update');

        // Company profile
        Route::get('company/profile', [CompanyProfileController::class, 'me'])->name('company.profile.me');
        Route::put('company/profile', [CompanyProfileController::class, 'update'])->name('company.profile.update');

        // Offers management (company)
        Route::post('offers', [OfferController::class, 'store'])->name('offers.store');
        Route::put('offers/{offer}', [OfferController::class, 'update'])->name('offers.update');
        Route::delete('offers/{offer}', [OfferController::class, 'destroy'])->name('offers.destroy');
        Route::patch('offers/{offer}/pause', [OfferController::class, 'pause'])->name('offers.pause');
        Route::patch('offers/{offer}/reopen', [OfferController::class, 'reopen'])->name('offers.reopen');

        // Applications
        Route::post('offers/{offer}/apply', [ApplicationController::class, 'store'])->name('applications.store');
        Route::get('applications', [ApplicationController::class, 'index'])->name('applications.index');
        Route::patch('applications/{application}/accept', [ApplicationController::class, 'accept'])->name('applications.accept');
        Route::patch('applications/{application}/reject', [ApplicationController::class, 'reject'])->name('applications.reject');
        Route::patch('applications/{application}/withdraw', [ApplicationController::class, 'withdraw'])->name('applications.withdraw');

        // Matching
        Route::get('offers/recommended', [MatchingController::class, 'recommended'])->name('offers.recommended');

        // Messages
        Route::get('applications/{application}/messages', [MessageController::class, 'index'])->name('messages.index');
        Route::post('applications/{application}/messages', [MessageController::class, 'store'])->name('messages.store');

        // Reviews
        Route::post('applications/{application}/review', [ReviewController::class, 'store'])->name('reviews.store');
    });
});
