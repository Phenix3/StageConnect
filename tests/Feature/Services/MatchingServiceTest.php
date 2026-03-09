<?php

use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\Skill;
use App\Models\StudentProfile;
use App\Models\User;
use App\Services\MatchingService;

beforeEach(function () {
    $this->service = new MatchingService();
});

test('perfect skill match gives 100 skill score', function () {
    $student = User::factory()->create(['role' => 'student'])->studentProfile()->create([]);
    $company = User::factory()->create(['role' => 'company'])->companyProfile()->create(['name' => 'Corp']);
    $offer = Offer::create([
        'company_id' => $company->id,
        'title' => 'Dev Job',
        'description' => 'Desc',
        'type' => 'stage',
        'status' => 'active',
    ]);

    $php = Skill::create(['name' => 'PHP', 'slug' => 'php']);
    $student->skills()->attach($php->id);
    $offer->skills()->attach($php->id, ['is_required' => true]);

    $score = $this->service->calculateScore($student, $offer);

    expect($score)->toBeGreaterThan(50);
});

test('remote offer gives full location score regardless of city', function () {
    $student = User::factory()->create(['role' => 'student'])->studentProfile()->create(['city' => 'Lyon']);
    $company = User::factory()->create(['role' => 'company'])->companyProfile()->create(['name' => 'Corp']);
    $offer = Offer::create([
        'company_id' => $company->id,
        'title' => 'Remote Job',
        'description' => 'Desc',
        'type' => 'stage',
        'status' => 'active',
        'city' => 'Paris',
        'remote' => true,
    ]);

    $score = $this->service->calculateScore($student, $offer);

    expect($score)->toBeGreaterThan(40); // location contributes 20% fully
});

test('matching level gives higher score than mismatched level', function () {
    $company = User::factory()->create(['role' => 'company'])->companyProfile()->create(['name' => 'Corp']);
    $offer = Offer::create([
        'company_id' => $company->id,
        'title' => 'Job',
        'description' => 'Desc',
        'type' => 'stage',
        'level_required' => 'bac+3',
        'status' => 'active',
    ]);

    $student1 = User::factory()->create(['role' => 'student'])->studentProfile()->create(['level' => 'bac+3']);
    $student2 = User::factory()->create(['role' => 'student'])->studentProfile()->create(['level' => 'bac']);

    $score1 = $this->service->calculateScore($student1, $offer);
    $score2 = $this->service->calculateScore($student2, $offer);

    expect($score1)->toBeGreaterThan($score2);
});

test('language match improves score', function () {
    $company = User::factory()->create(['role' => 'company'])->companyProfile()->create(['name' => 'Corp']);
    $offer = Offer::create([
        'company_id' => $company->id,
        'title' => 'Job',
        'description' => 'Desc',
        'type' => 'stage',
        'status' => 'active',
        'languages' => ['English', 'French'],
    ]);

    $student1 = User::factory()->create(['role' => 'student'])->studentProfile()->create(['languages' => ['English', 'French']]);
    $student2 = User::factory()->create(['role' => 'student'])->studentProfile()->create(['languages' => []]);

    $score1 = $this->service->calculateScore($student1, $offer);
    $score2 = $this->service->calculateScore($student2, $offer);

    expect($score1)->toBeGreaterThan($score2);
});

test('score is between 0 and 100', function () {
    $student = User::factory()->create(['role' => 'student'])->studentProfile()->create([]);
    $company = User::factory()->create(['role' => 'company'])->companyProfile()->create(['name' => 'Corp']);
    $offer = Offer::create([
        'company_id' => $company->id,
        'title' => 'Job',
        'description' => 'Desc',
        'type' => 'stage',
        'status' => 'active',
    ]);

    $score = $this->service->calculateScore($student, $offer);

    expect($score)->toBeGreaterThanOrEqual(0)->toBeLessThanOrEqual(100);
});
