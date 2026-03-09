import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

interface Skill {
    id: number;
    name: string;
    slug: string;
}

interface StudentProfile {
    bio?: string;
    level?: string;
    school?: string;
    city?: string;
    languages?: string[];
    cv_path?: string;
    availability_from?: string;
    availability_to?: string;
    skills?: Skill[];
}

interface Props {
    profile?: StudentProfile;
    skills: Skill[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profile Setup', href: '/student/profile/edit' },
];

const LEVELS = ['bac', 'bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5', 'bac+8'];
const LANGUAGES = ['French', 'English', 'Spanish', 'Arabic', 'German', 'Portuguese'];

export default function StudentProfileSetup({ profile, skills }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        bio: profile?.bio ?? '',
        level: profile?.level ?? '',
        school: profile?.school ?? '',
        city: profile?.city ?? '',
        languages: profile?.languages ?? [] as string[],
        availability_from: profile?.availability_from ?? '',
        availability_to: profile?.availability_to ?? '',
        skill_ids: profile?.skills?.map((s) => s.id) ?? [] as number[],
        cv: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/student/profile', {
            forceFormData: true,
        });
    }

    function toggleSkill(id: number) {
        setData('skill_ids', data.skill_ids.includes(id)
            ? data.skill_ids.filter((s) => s !== id)
            : [...data.skill_ids, id]);
    }

    function toggleLanguage(lang: string) {
        setData('languages', data.languages.includes(lang)
            ? data.languages.filter((l) => l !== lang)
            : [...data.languages, lang]);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile Setup" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold mb-6">Complete your profile</h1>
                    <form onSubmit={submit} className="flex flex-col gap-6" encType="multipart/form-data">
                        {/* Bio */}
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                            <InputError message={errors.bio} />
                        </div>

                        {/* Level */}
                        <div className="grid gap-2">
                            <Label htmlFor="level">Education Level</Label>
                            <select
                                id="level"
                                value={data.level}
                                onChange={(e) => setData('level', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            >
                                <option value="">Select level...</option>
                                {LEVELS.map((l) => (
                                    <option key={l} value={l}>{l.toUpperCase()}</option>
                                ))}
                            </select>
                            <InputError message={errors.level} />
                        </div>

                        {/* School */}
                        <div className="grid gap-2">
                            <Label htmlFor="school">School / University</Label>
                            <Input
                                id="school"
                                value={data.school}
                                onChange={(e) => setData('school', e.target.value)}
                                placeholder="Your school name"
                            />
                            <InputError message={errors.school} />
                        </div>

                        {/* City */}
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="Your city"
                            />
                            <InputError message={errors.city} />
                        </div>

                        {/* Languages */}
                        <div className="grid gap-2">
                            <Label>Languages</Label>
                            <div className="flex flex-wrap gap-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => toggleLanguage(lang)}
                                        className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                                            data.languages.includes(lang)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-input hover:bg-accent'
                                        }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.languages} />
                        </div>

                        {/* Skills */}
                        <div className="grid gap-2">
                            <Label>Skills</Label>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <button
                                        key={skill.id}
                                        type="button"
                                        onClick={() => toggleSkill(skill.id)}
                                        className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                                            data.skill_ids.includes(skill.id)
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'border-input hover:bg-accent'
                                        }`}
                                    >
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.skill_ids} />
                        </div>

                        {/* Availability */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="availability_from">Available from</Label>
                                <Input
                                    id="availability_from"
                                    type="date"
                                    value={data.availability_from}
                                    onChange={(e) => setData('availability_from', e.target.value)}
                                />
                                <InputError message={errors.availability_from} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="availability_to">Available until</Label>
                                <Input
                                    id="availability_to"
                                    type="date"
                                    value={data.availability_to}
                                    onChange={(e) => setData('availability_to', e.target.value)}
                                />
                                <InputError message={errors.availability_to} />
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="cv">CV (PDF, DOC, DOCX — max 5MB)</Label>
                            {profile?.cv_path && (
                                <p className="text-sm text-muted-foreground">Current CV uploaded. Upload a new one to replace it.</p>
                            )}
                            <Input
                                id="cv"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('cv', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.cv} />
                        </div>

                        <Button type="submit" disabled={processing} className="w-fit">
                            Save Profile
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
