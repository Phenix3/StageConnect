import { Head, Link } from '@inertiajs/react';
import { Bookmark } from 'lucide-react';
import BookmarkButton from '@/components/bookmark-button';
import PublicOfferCard from '@/components/public-offer-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Skill { id: number; name: string; }
interface Company { id: number; name: string; logo?: string; }
interface Offer {
    id: number;
    title: string;
    city?: string;
    remote: boolean;
    type: string;
    level_required?: string;
    duration?: string;
    is_premium: boolean;
    company: Company;
    skills: Skill[];
}
interface Paginator<T> { data: T[]; current_page: number; last_page: number; }
interface Props { offers: Paginator<Offer>; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Saved Offers', href: '/student/bookmarks' },
];

export default function StudentBookmarks({ offers }: Props) {
    const savedIds = offers.data.map((o) => o.id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Saved Offers" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div>
                    <h1
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                            fontWeight: 700,
                            color: '#0F172A',
                            letterSpacing: '-0.02em',
                            marginBottom: '0.25rem',
                        }}
                    >
                        Saved Offers
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
                        {offers.data.length > 0
                            ? `${offers.data.length} saved offer${offers.data.length > 1 ? 's' : ''}`
                            : 'No saved offers yet'}
                    </p>
                </div>

                {/* Empty state */}
                {offers.data.length === 0 ? (
                    <div
                        style={{
                            background: 'rgba(255,255,255,0.72)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.85)',
                            borderRadius: '1.25rem',
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            boxShadow: '0 4px 24px rgba(30,64,175,0.07)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <Bookmark size={48} style={{ color: '#3B82F6', opacity: 0.4 }} />
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#0F172A', fontSize: '1.125rem' }}>
                            No saved offers
                        </p>
                        <p style={{ color: '#64748B', fontSize: '0.9375rem', maxWidth: '26rem' }}>
                            Browse offers and click the bookmark icon to save them here.
                        </p>
                        <Link
                            href="/offers"
                            style={{
                                marginTop: '0.5rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#1E40AF',
                                color: 'white',
                                padding: '0.625rem 1.5rem',
                                borderRadius: '0.625rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                transition: 'opacity 200ms',
                            }}
                            className="hover:opacity-85"
                        >
                            Browse Offers
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {offers.data.map((offer) => (
                            <PublicOfferCard
                                key={offer.id}
                                offer={offer}
                                href={`/offers/${offer.id}`}
                                rightSlot={
                                    <BookmarkButton
                                        offerId={offer.id}
                                        initialSaved={savedIds.includes(offer.id)}
                                        size="sm"
                                    />
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
