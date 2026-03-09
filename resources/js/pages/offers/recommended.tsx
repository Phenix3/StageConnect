import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Skill { id: number; name: string; }
interface Company { id: number; name: string; }
interface Offer {
    id: number; title: string; type: string; city?: string; remote: boolean;
    is_premium: boolean; company: Company; skills: Skill[];
}
interface RecommendedOffer { offer: Offer; score: number; }
interface Props { offers: RecommendedOffer[]; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Recommended Offers', href: '/offers/recommended' },
];

export default function RecommendedOffers({ offers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recommended Offers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Recommended for You</h1>
                {offers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No recommendations yet. Complete your profile to get personalized offers.</p>
                        <Link href="/student/profile/edit" className="text-primary hover:underline mt-2 block">Complete Profile</Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {offers.map(({ offer, score }) => (
                            <Link
                                key={offer.id}
                                href={`/offers/${offer.id}`}
                                className="block rounded-xl border p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs uppercase tracking-wide text-muted-foreground">{offer.type}</span>
                                    <span className="text-sm font-semibold text-primary">{score.toFixed(0)}% match</span>
                                </div>
                                <h3 className="font-semibold mb-1 line-clamp-2">{offer.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{offer.company.name}</p>
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                    {offer.city && <span>{offer.city}</span>}
                                    {offer.remote && <span>· Remote</span>}
                                </div>
                                {offer.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {offer.skills.slice(0, 3).map((s) => (
                                            <span key={s.id} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{s.name}</span>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
