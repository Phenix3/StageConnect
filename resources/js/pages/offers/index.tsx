import { Head, router } from '@inertiajs/react';
import { Briefcase, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import PublicOfferCard from '@/components/public-offer-card';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';

interface Skill { id: number; name: string; slug: string; }
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
    expires_at?: string;
    company: Company;
    skills: Skill[];
    created_at: string;
}
interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url?: string;
    prev_page_url?: string;
}
interface Props {
    offers: Paginator<Offer>;
    skills: Skill[];
    filters: Record<string, string | boolean | string[]>;
}

export default function OffersIndex({ offers, filters }: Props) {
    const [search, setSearch] = useState({
        type: (filters.type as string) ?? '',
        city: (filters.city as string) ?? '',
        remote: filters.remote ? '1' : '',
        level: (filters.level as string) ?? '',
    });

    const hasFilters = search.type || search.city || search.remote || search.level;
    const total = offers.data.length;

    function applyFilters() {
        router.get('/offers', { ...search, remote: search.remote ? true : undefined }, { preserveState: true });
    }

    function resetFilters() {
        setSearch({ type: '', city: '', remote: '', level: '' });
        router.get('/offers');
    }

    const selectStyle: React.CSSProperties = {
        height: '2.25rem',
        borderRadius: '0.625rem',
        border: '1px solid rgba(147,197,253,0.5)',
        background: 'rgba(255,255,255,0.8)',
        padding: '0 0.75rem',
        fontSize: '0.875rem',
        color: '#0F172A',
        cursor: 'pointer',
        outline: 'none',
    };

    return (
        <PublicLayout title="Browse Offers" activeNav="offers">
            <Head title="Browse Offers" />

            {/* Hero-lite */}
            <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
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
                    Browse{' '}
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #0EA5E9 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Opportunities
                    </span>
                </h1>
                <p style={{ color: '#64748B', fontSize: '1rem' }}>
                    {offers.data.length > 0
                        ? `${total} offer${total > 1 ? 's' : ''} found · Page ${offers.current_page}/${offers.last_page}`
                        : 'No offers found — try adjusting your filters'}
                </p>
            </div>

            {/* Filter bar */}
            <div
                style={{
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.85)',
                    borderRadius: '1rem',
                    padding: '1rem 1.25rem',
                    boxShadow: '0 2px 16px rgba(30,64,175,0.06)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'flex-end',
                    gap: '0.75rem',
                    marginBottom: '1.75rem',
                }}
            >
                <SlidersHorizontal size={16} style={{ color: '#64748B', alignSelf: 'center', flexShrink: 0 }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', fontFamily: "'Space Grotesk', sans-serif" }}>Type</label>
                    <select value={search.type} onChange={(e) => setSearch({ ...search, type: e.target.value })} style={selectStyle}>
                        <option value="">All types</option>
                        <option value="stage">Internship</option>
                        <option value="alternance">Apprenticeship</option>
                        <option value="emploi">Job</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', fontFamily: "'Space Grotesk', sans-serif" }}>Level</label>
                    <select value={search.level} onChange={(e) => setSearch({ ...search, level: e.target.value })} style={selectStyle}>
                        <option value="">All levels</option>
                        <option value="bac">Bac</option>
                        <option value="bac+2">Bac+2</option>
                        <option value="bac+3">Bac+3</option>
                        <option value="bac+4">Bac+4</option>
                        <option value="bac+5">Bac+5</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', fontFamily: "'Space Grotesk', sans-serif" }}>City</label>
                    <Input
                        value={search.city}
                        onChange={(e) => setSearch({ ...search, city: e.target.value })}
                        placeholder="Any city"
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        style={{
                            height: '2.25rem',
                            width: '9rem',
                            fontSize: '0.875rem',
                            border: '1px solid rgba(147,197,253,0.5)',
                            background: 'rgba(255,255,255,0.8)',
                            borderRadius: '0.625rem',
                        }}
                    />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#334155', cursor: 'pointer', alignSelf: 'flex-end', paddingBottom: '0.125rem' }}>
                    <input
                        type="checkbox"
                        checked={search.remote === '1'}
                        onChange={(e) => setSearch({ ...search, remote: e.target.checked ? '1' : '' })}
                        style={{ width: '1rem', height: '1rem', cursor: 'pointer', accentColor: '#1E40AF' }}
                    />
                    Remote only
                </label>

                <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
                    <button
                        onClick={applyFilters}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            backgroundColor: '#1E40AF',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.625rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'opacity 200ms',
                        }}
                        className="hover:opacity-85"
                    >
                        <Search size={14} /> Search
                    </button>
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                background: 'rgba(255,255,255,0.7)',
                                color: '#334155',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.625rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                border: '1px solid rgba(203,213,225,0.6)',
                                cursor: 'pointer',
                                transition: 'background 200ms',
                            }}
                            className="hover:bg-white/90"
                        >
                            <X size={14} /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Offers grid */}
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
                    <Briefcase size={40} style={{ color: '#3B82F6', opacity: 0.4 }} />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#0F172A', fontSize: '1.125rem' }}>No offers found</p>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>Try adjusting your filters or check back later.</p>
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            style={{
                                marginTop: '0.5rem',
                                background: 'rgba(219,234,254,0.6)',
                                color: '#1E40AF',
                                border: '1px solid rgba(147,197,253,0.5)',
                                borderRadius: '2rem',
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {offers.data.map((offer) => (
                        <PublicOfferCard
                            key={offer.id}
                            offer={offer}
                            href={`/offers/${offer.id}`}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {offers.last_page > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
                    {offers.prev_page_url && (
                        <button
                            onClick={() => router.get(offers.prev_page_url!)}
                            style={{
                                background: 'rgba(219,234,254,0.6)',
                                color: '#1E40AF',
                                border: '1px solid rgba(147,197,253,0.5)',
                                borderRadius: '2rem',
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 200ms',
                            }}
                            className="hover:bg-blue-100/60"
                        >
                            ← Previous
                        </button>
                    )}
                    <span style={{ fontSize: '0.875rem', color: '#64748B' }}>
                        Page {offers.current_page} / {offers.last_page}
                    </span>
                    {offers.next_page_url && (
                        <button
                            onClick={() => router.get(offers.next_page_url!)}
                            style={{
                                background: 'rgba(219,234,254,0.6)',
                                color: '#1E40AF',
                                border: '1px solid rgba(147,197,253,0.5)',
                                borderRadius: '2rem',
                                padding: '0.5rem 1.25rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background 200ms',
                            }}
                            className="hover:bg-blue-100/60"
                        >
                            Next →
                        </button>
                    )}
                </div>
            )}
        </PublicLayout>
    );
}
