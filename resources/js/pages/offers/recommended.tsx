import { Head, Link } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import PublicOfferCard from '@/components/public-offer-card';

interface Skill { id: number; name: string; }
interface Company { id: number; name: string; }
interface Offer {
    id: number; title: string; type: string; city?: string; remote: boolean;
    is_premium: boolean; company: Company; skills: Skill[];
}
interface RecommendedOffer { offer: Offer; score: number; }
interface Props { offers: RecommendedOffer[]; }

export default function RecommendedOffers({ offers }: Props) {
    return (
        <PublicLayout title="Recommended for You" activeNav="recommended">
            <Head title="Recommended for You" />

            {/* Hero */}
            <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h1
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                fontWeight: 700,
                                color: '#0F172A',
                                letterSpacing: '-0.02em',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Your{' '}
                            <span
                                style={{
                                    background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #0EA5E9 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Personalized
                            </span>{' '}
                            Matches
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '0.75rem' }}>
                            Based on your skills, location, and availability.
                        </p>
                        {offers.length > 0 && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    background: 'rgba(219,234,254,0.7)',
                                    color: '#1E40AF',
                                    border: '1px solid rgba(147,197,253,0.5)',
                                    borderRadius: '2rem',
                                    padding: '0.25rem 0.875rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                }}
                            >
                                <TrendingUp size={13} />
                                {offers.length} offer{offers.length > 1 ? 's' : ''} found
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {offers.length === 0 ? (
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
                    <TrendingUp size={48} style={{ color: '#3B82F6', opacity: 0.4 }} />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#0F172A', fontSize: '1.125rem' }}>
                        No matches yet
                    </p>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem', maxWidth: '26rem' }}>
                        Complete your profile to get personalized offers based on your skills and preferences.
                    </p>
                    <Link
                        href="/student/profile/edit"
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
                        Complete Profile
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {offers.map(({ offer, score }) => (
                        <PublicOfferCard
                            key={offer.id}
                            offer={offer}
                            matchScore={score}
                            href={`/offers/${offer.id}`}
                        />
                    ))}
                </div>
            )}
        </PublicLayout>
    );
}
