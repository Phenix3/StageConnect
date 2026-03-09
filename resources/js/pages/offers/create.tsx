import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

interface Skill { id: number; name: string; slug: string; }
interface Props { skills: Skill[]; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Offers', href: '/offers' },
    { title: 'Create Offer', href: '/offers/create' },
];

const TYPES = ['stage', 'alternance', 'emploi'];
const LEVELS = ['bac', 'bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5', 'bac+8'];

export default function CreateOffer({ skills }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        duration: '',
        city: '',
        remote: false,
        type: 'stage',
        level_required: '',
        languages: [] as string[],
        expires_at: '',
        skill_ids: [] as number[],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/offers');
    }

    function toggleSkill(id: number) {
        setData('skill_ids', data.skill_ids.includes(id)
            ? data.skill_ids.filter((s) => s !== id)
            : [...data.skill_ids, id]);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Offer" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold mb-6">Post a new offer</h1>
                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Type *</Label>
                            <select id="type" value={data.type} onChange={(e) => setData('type', e.target.value as 'stage' | 'alternance' | 'emploi')}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <InputError message={errors.type} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={6} required />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                <InputError message={errors.city} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" value={data.duration} onChange={(e) => setData('duration', e.target.value)} placeholder="e.g. 3 months" />
                                <InputError message={errors.duration} />
                            </div>
                        </div>

                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={data.remote} onChange={(e) => setData('remote', e.target.checked)} />
                            Remote work possible
                        </label>

                        <div className="grid gap-2">
                            <Label htmlFor="level_required">Level Required</Label>
                            <select id="level_required" value={data.level_required} onChange={(e) => setData('level_required', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                                <option value="">No specific requirement</option>
                                {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                            </select>
                            <InputError message={errors.level_required} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="expires_at">Expires At</Label>
                            <Input id="expires_at" type="date" value={data.expires_at} onChange={(e) => setData('expires_at', e.target.value)} />
                            <InputError message={errors.expires_at} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Skills Required</Label>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)}
                                        className={`rounded-full px-3 py-1 text-sm border transition-colors ${
                                            data.skill_ids.includes(skill.id) ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-accent'
                                        }`}>
                                        {skill.name}
                                    </button>
                                ))}
                            </div>
                            <InputError message={errors.skill_ids} />
                        </div>

                        <Button type="submit" disabled={processing} className="w-fit">Post Offer</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
