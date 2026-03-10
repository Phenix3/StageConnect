import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface Skill { id: number; name: string; slug: string; }
interface Offer {
    id: number; title: string; description: string; duration?: string; city?: string;
    remote: boolean; type: string; level_required?: string; expires_at?: string;
    skills: Skill[];
}
interface Props { offer: Offer; skills: Skill[]; }

const TYPES = ['stage', 'alternance', 'emploi'];
const LEVELS = ['bac', 'bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5', 'bac+8'];

export default function EditOffer({ offer, skills }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Offers', href: '/offers' },
        { title: offer.title, href: `/offers/${offer.id}` },
        { title: 'Edit', href: `/offers/${offer.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: offer.title,
        description: offer.description,
        duration: offer.duration ?? '',
        city: offer.city ?? '',
        remote: offer.remote,
        type: offer.type,
        level_required: offer.level_required ?? '',
        expires_at: offer.expires_at ?? '',
        skill_ids: offer.skills.map((s) => s.id),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/offers/${offer.id}`);
    }

    function toggleSkill(id: number) {
        setData('skill_ids', data.skill_ids.includes(id)
            ? data.skill_ids.filter((s) => s !== id)
            : [...data.skill_ids, id]);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${offer.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold mb-6">Edit offer</h1>
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
                                <Label>City</Label>
                                <Input value={data.city} onChange={(e) => setData('city', e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Duration</Label>
                                <Input value={data.duration} onChange={(e) => setData('duration', e.target.value)} />
                            </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="checkbox" checked={data.remote} onChange={(e) => setData('remote', e.target.checked)} />
                            Remote work possible
                        </label>
                        <div className="grid gap-2">
                            <Label>Level Required</Label>
                            <select value={data.level_required} onChange={(e) => setData('level_required', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                                <option value="">No specific requirement</option>
                                {LEVELS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Expires At</Label>
                            <Input type="date" value={data.expires_at} onChange={(e) => setData('expires_at', e.target.value)} />
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
                        </div>
                        <Button type="submit" disabled={processing} className="w-fit">Save Changes</Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
