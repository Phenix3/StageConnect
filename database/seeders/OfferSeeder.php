<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use App\Models\Offer;
use App\Models\Skill;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        $techCorp = CompanyProfile::where('name', 'TechCorp')->first();
        $marketCo = CompanyProfile::where('name', 'MarketCo')->first();

        if (! $techCorp || ! $marketCo) {
            return;
        }

        $php = Skill::where('slug', 'php')->first();
        $js = Skill::where('slug', 'javascript')->first();
        $react = Skill::where('slug', 'react')->first();
        $sql = Skill::where('slug', 'sql')->first();
        $marketing = Skill::where('slug', 'marketing')->first();
        $communication = Skill::where('slug', 'communication')->first();

        $offers = [
            [
                'company_id' => $techCorp->id,
                'title' => 'Stage Développeur PHP/Laravel',
                'description' => 'Rejoignez notre équipe backend pour développer des applications web robustes avec Laravel. Vous travaillerez sur des projets réels en équipe agile.',
                'duration' => '3 mois',
                'city' => 'Paris',
                'remote' => false,
                'type' => 'stage',
                'level_required' => 'bac+3',
                'languages' => ['French', 'English'],
                'status' => 'active',
                'is_premium' => true,
                'expires_at' => '2026-09-30',
                'skills' => $php && $sql ? [$php->id, $sql->id] : [],
            ],
            [
                'company_id' => $techCorp->id,
                'title' => 'Alternance React Developer',
                'description' => 'Développez des interfaces utilisateur modernes avec React et TypeScript dans une startup tech en pleine croissance.',
                'duration' => '12 mois',
                'city' => 'Paris',
                'remote' => true,
                'type' => 'alternance',
                'level_required' => 'bac+4',
                'languages' => ['French'],
                'status' => 'active',
                'is_premium' => false,
                'expires_at' => '2026-10-01',
                'skills' => $js && $react ? [$js->id, $react->id] : [],
            ],
            [
                'company_id' => $marketCo->id,
                'title' => 'Stage Marketing Digital',
                'description' => 'Participez à la création et la gestion de campagnes marketing digitales pour nos clients. Forte autonomie et apprentissage garanti.',
                'duration' => '4 mois',
                'city' => 'Lyon',
                'remote' => true,
                'type' => 'stage',
                'level_required' => 'bac+4',
                'languages' => ['French', 'English'],
                'status' => 'active',
                'is_premium' => false,
                'expires_at' => '2026-08-31',
                'skills' => $marketing && $communication ? [$marketing->id, $communication->id] : [],
            ],
        ];

        foreach ($offers as $offerData) {
            $skillIds = $offerData['skills'];
            unset($offerData['skills']);

            $offer = Offer::firstOrCreate(
                ['title' => $offerData['title'], 'company_id' => $offerData['company_id']],
                $offerData
            );

            if ($skillIds) {
                $offer->skills()->syncWithoutDetaching(array_fill_keys($skillIds, ['is_required' => true]));
            }
        }
    }
}
