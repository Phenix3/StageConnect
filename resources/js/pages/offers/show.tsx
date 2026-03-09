import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

interface Skill { id: number; name: string; }
interface Company { id: number; name: string; logo?: string; sector?: string; size?: string; }
interface Offer {
    id: number;
    title: string;
    description: string;
    city?: string;
    remote: boolean;
    type: string;
    level_required?: string;
    duration?: string;
    languages?: string[];
    is_premium: boolean;
    expires_at?: string;
    company: Company;
    skills: Skill[];
}
interface Props {
    offer: Offer;
    auth: { user?: { role: string } };
    alreadyApplied: boolean;
}

export default function OfferShow({ offer, auth, alreadyApplied }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Offers', href: '/offers' },
        { title: offer.title, href: `/offers/${offer.id}` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        cover_letter: '',
    });

    function apply(e: React.FormEvent) {
        e.preventDefault();
        post(`/offers/${offer.id}/apply`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={offer.title} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-3xl">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">{offer.type}</span>
                            {offer.is_premium && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Premium</span>}
                        </div>
                        <h1 className="text-2xl font-bold">{offer.title}</h1>
                        <Link href={`/companies/${offer.company.id}`} className="text-primary hover:underline">
                            {offer.company.name}
                        </Link>
                    </div>
                    {auth.user?.role === 'company' && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/offers/${offer.id}/edit`}>Edit</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {offer.city && <span>📍 {offer.city}</span>}
                    {offer.remote && <span>🏠 Remote</span>}
                    {offer.duration && <span>⏱ {offer.duration}</span>}
                    {offer.level_required && <span>🎓 {offer.level_required.toUpperCase()}</span>}
                    {offer.expires_at && <span>📅 Expires {offer.expires_at}</span>}
                </div>

                {/* Skills */}
                {offer.skills.length > 0 && (
                    <div>
                        <h2 className="font-semibold mb-2">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {offer.skills.map((s) => (
                                <span key={s.id} className="text-sm bg-secondary px-3 py-1 rounded-full">{s.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div>
                    <h2 className="font-semibold mb-2">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{offer.description}</p>
                </div>

                {/* Apply form */}
                {auth.user?.role === 'student' && (
                    alreadyApplied ? (
                        <div className="border rounded-xl p-4 bg-muted/50">
                            <p className="text-sm font-medium text-muted-foreground">✓ You have already applied to this offer.</p>
                        </div>
                    ) : (
                        <form onSubmit={apply} className="border rounded-xl p-4 flex flex-col gap-4">
                            <h2 className="font-semibold">Apply to this offer</h2>
                            <div className="grid gap-2">
                                <Label htmlFor="cover_letter">Cover Letter (optional)</Label>
                                <Textarea
                                    id="cover_letter"
                                    value={data.cover_letter}
                                    onChange={(e) => setData('cover_letter', e.target.value)}
                                    placeholder="Introduce yourself and explain why you're interested..."
                                    rows={5}
                                />
                                <InputError message={errors.cover_letter} />
                            </div>
                            <Button type="submit" disabled={processing} className="w-fit">
                                Submit Application
                            </Button>
                        </form>
                    )
                )}
            </div>
        </AppLayout>
    );
}
