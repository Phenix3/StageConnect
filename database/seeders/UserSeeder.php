<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::firstOrCreate(
            ['email' => 'admin@stageconnect.test'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Students
        $student1 = User::firstOrCreate(
            ['email' => 'alice@stageconnect.test'],
            [
                'name' => 'Alice Martin',
                'password' => Hash::make('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]
        );

        $student1->studentProfile()->firstOrCreate(['user_id' => $student1->id], [
            'bio' => 'Computer science student passionate about web development.',
            'level' => 'bac+3',
            'school' => 'EPITECH Paris',
            'city' => 'Paris',
            'languages' => ['French', 'English'],
            'availability_from' => '2026-06-01',
            'availability_to' => '2026-08-31',
        ]);

        if ($student1->studentProfile) {
            $phpSkill = Skill::where('slug', 'php')->first();
            $jsSkill = Skill::where('slug', 'javascript')->first();
            if ($phpSkill && $jsSkill) {
                $student1->studentProfile->skills()->syncWithoutDetaching([$phpSkill->id, $jsSkill->id]);
            }
        }

        $student2 = User::firstOrCreate(
            ['email' => 'bob@stageconnect.test'],
            [
                'name' => 'Bob Dupont',
                'password' => Hash::make('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]
        );

        $student2->studentProfile()->firstOrCreate(['user_id' => $student2->id], [
            'bio' => 'Marketing student looking for an internship.',
            'level' => 'bac+4',
            'school' => 'Sciences Po Paris',
            'city' => 'Lyon',
            'languages' => ['French', 'Spanish'],
            'availability_from' => '2026-07-01',
            'availability_to' => '2026-09-30',
        ]);

        // Companies
        $company1 = User::firstOrCreate(
            ['email' => 'tech@stageconnect.test'],
            [
                'name' => 'TechCorp HR',
                'password' => Hash::make('password'),
                'role' => 'company',
                'email_verified_at' => now(),
            ]
        );

        $company1->companyProfile()->firstOrCreate(['user_id' => $company1->id], [
            'name' => 'TechCorp',
            'sector' => 'Technology',
            'size' => '51-200',
            'description' => 'Leading software development company specializing in web and mobile applications.',
            'website' => 'https://techcorp.example.com',
            'verified' => true,
            'plan' => 'pro',
        ]);

        $company2 = User::firstOrCreate(
            ['email' => 'marketing@stageconnect.test'],
            [
                'name' => 'MarketCo HR',
                'password' => Hash::make('password'),
                'role' => 'company',
                'email_verified_at' => now(),
            ]
        );

        $company2->companyProfile()->firstOrCreate(['user_id' => $company2->id], [
            'name' => 'MarketCo',
            'sector' => 'Marketing & Communication',
            'size' => '11-50',
            'description' => 'Digital marketing agency helping brands grow.',
            'website' => 'https://marketco.example.com',
            'verified' => false,
            'plan' => 'starter',
        ]);
    }
}
