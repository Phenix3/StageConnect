<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            'PHP', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Python',
            'Java', 'SQL', 'PostgreSQL', 'MySQL', 'Laravel', 'Node.js',
            'Marketing', 'Communication', 'Project Management', 'Accounting',
            'Design UI', 'Figma', 'English', 'French', 'Arabic', 'Spanish',
            'Git', 'Docker', 'Linux', 'REST API', 'GraphQL', 'Machine Learning',
        ];

        foreach ($skills as $name) {
            Skill::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
