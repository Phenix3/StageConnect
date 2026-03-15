import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, Clock, GraduationCap, MapPin, Monitor } from 'lucide-react';
import BookmarkButton from '@/components/bookmark-button';
import InputError from '@/components/input-error';
import MatchingScoreBreakdown, { type MatchDetail } from '@/components/matching-score-breakdown';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';

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
    isSaved: boolean;
    matchDetail?: MatchDetail | null;
}

const TYPE_STYLES: Record<string, { background: string; color: string; border: string; label: string }> = {
    stage: { label: 'Internship', background: 'rgba(219,234,254,0.85)', color: '#1E40AF', border: '1px solid rgba(147,197,253,0.5)' },
    alternance: { label: 'Apprenticeship', background: 'rgba(237,233,254,0.85)', color: '#5B21B6', border: '1px solid rgba(196,181,253,0.5)' },
    emploi: { label: 'Job', background: 'rgba(209,250,229,0.85)', color: '#065F46', border: '1px solid rgba(110,231,183,0.5)' },
};

function CompanyAvatar({ name, logo }: { name: string; logo?: string }) {
    if (logo) {
        return (
            <img
                src={logo}
                alt={name}
                style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', objectFit: 'cover', border: '1px solid rgba(219,234,254,0.8)', flexShrink: 0 }}
            />
        );
    }
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    return (
        <div
            style={{
                width: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
                color: '#1E40AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 700,
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
}

const CARD: React.CSSProperties = {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.85)',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(30,64,175,0.07)',
};

export default function OfferShow({ offer, auth, alreadyApplied, isSaved, matchDetail }: Props) {
    const { data, setData, post, processing, errors } = useForm({ cover_letter: '' });
    const typeStyle = TYPE_STYLES[offer.type] ?? { label: offer.type, background: 'rgba(241,245,249,0.85)', color: '#475569', border: '1px solid rgba(203,213,225,0.5)' };

    function apply(e: React.FormEvent) {
        e.preventDefault();
        post(`/offers/${offer.id}/apply`);
    }

    return (
        <PublicLayout title={offer.title} activeNav="offers">
            <Head title={offer.title} />

            <div style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ── Left column ── */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Header card */}
                        <div style={CARD}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
                                    <CompanyAvatar name={offer.company.name} logo={offer.company.logo} />

                                    <div>
                                        <Link
                                            href={`/companies/${offer.company.id}`}
                                            style={{ fontSize: '0.875rem', fontWeight: 500, color: '#3B82F6', textDecoration: 'none' }}
                                            className="hover:underline"
                                        >
                                            {offer.company.name}
                                        </Link>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                            <span
                                                style={{
                                                    background: typeStyle.background,
                                                    color: typeStyle.color,
                                                    border: typeStyle.border,
                                                    borderRadius: '2rem',
                                                    padding: '0.125rem 0.625rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {typeStyle.label}
                                            </span>
                                            {offer.is_premium && (
                                                <span
                                                    style={{
                                                        background: 'rgba(254,243,199,0.9)',
                                                        color: '#92400E',
                                                        border: '1px solid rgba(252,211,77,0.4)',
                                                        borderRadius: '2rem',
                                                        padding: '0.125rem 0.625rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {auth.user?.role === 'student' && (
                                    <BookmarkButton offerId={offer.id} initialSaved={isSaved} />
                                )}
                            </div>

                            <h1
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    letterSpacing: '-0.015em',
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                    lineHeight: 1.25,
                                }}
                            >
                                {offer.title}
                            </h1>

                            {/* Meta */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {(offer.city || offer.remote) && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#475569' }}>
                                        {offer.remote ? <Monitor size={14} /> : <MapPin size={14} />}
                                        {offer.remote ? 'Remote' : offer.city}
                                    </span>
                                )}
                                {offer.duration && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#475569' }}>
                                        <Clock size={14} /> {offer.duration}
                                    </span>
                                )}
                                {offer.level_required && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#475569' }}>
                                        <GraduationCap size={14} /> {offer.level_required.toUpperCase()}
                                    </span>
                                )}
                                {offer.expires_at && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#475569' }}>
                                        <Calendar size={14} /> Expires {offer.expires_at}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Skills card */}
                        {offer.skills.length > 0 && (
                            <div style={CARD}>
                                <h2
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 600,
                                        color: '#0F172A',
                                        fontSize: '1rem',
                                        marginBottom: '0.875rem',
                                    }}
                                >
                                    Required Skills
                                </h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {offer.skills.map((s) => (
                                        <span
                                            key={s.id}
                                            style={{
                                                background: 'rgba(219,234,254,0.6)',
                                                color: '#1E40AF',
                                                border: '1px solid rgba(147,197,253,0.4)',
                                                borderRadius: '2rem',
                                                padding: '0.25rem 0.875rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                            }}
                                        >
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description card */}
                        <div style={CARD}>
                            <h2
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600,
                                    color: '#0F172A',
                                    fontSize: '1rem',
                                    marginBottom: '0.875rem',
                                }}
                            >
                                Description
                            </h2>
                            <p style={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                                {offer.description}
                            </p>
                        </div>
                    </div>

                    {/* ── Right sidebar ── */}
                    <div className="w-full lg:w-80" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        {/* Apply / already applied */}
                        {auth.user?.role === 'student' && (
                            alreadyApplied ? (
                                <div
                                    style={{
                                        background: 'rgba(209,250,229,0.7)',
                                        backdropFilter: 'blur(12px)',
                                        WebkitBackdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(110,231,183,0.5)',
                                        borderRadius: '1.25rem',
                                        padding: '1.25rem 1.5rem',
                                        boxShadow: '0 4px 24px rgba(16,185,129,0.08)',
                                    }}
                                >
                                    <p style={{ color: '#065F46', fontWeight: 600, fontSize: '0.9375rem' }}>
                                        ✓ You have already applied to this offer.
                                    </p>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.85)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        border: '1px solid rgba(255,255,255,0.9)',
                                        borderRadius: '1.25rem',
                                        borderTop: '3px solid #3B82F6',
                                        padding: '1.5rem',
                                        boxShadow: '0 4px 24px rgba(30,64,175,0.09)',
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600,
                                            color: '#0F172A',
                                            fontSize: '1.0625rem',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        Apply to this offer
                                    </h2>
                                    <form onSubmit={apply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                            <Label
                                                htmlFor="cover_letter"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, color: '#0F172A', fontSize: '0.875rem' }}
                                            >
                                                Cover Letter <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span>
                                            </Label>
                                            <Textarea
                                                id="cover_letter"
                                                value={data.cover_letter}
                                                onChange={(e) => setData('cover_letter', e.target.value)}
                                                placeholder="Introduce yourself and explain why you're interested..."
                                                rows={5}
                                                className="bg-white/90 border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                                            />
                                            <InputError message={errors.cover_letter} />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            style={{
                                                width: '100%',
                                                background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                                                color: 'white',
                                                padding: '0.75rem',
                                                borderRadius: '0.75rem',
                                                border: 'none',
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                fontWeight: 600,
                                                fontSize: '0.9375rem',
                                                cursor: processing ? 'not-allowed' : 'pointer',
                                                opacity: processing ? 0.65 : 1,
                                                transition: 'opacity 200ms',
                                            }}
                                            className="hover:opacity-85"
                                        >
                                            Submit Application
                                        </button>
                                    </form>
                                </div>
                            )
                        )}

                        {/* Matching score breakdown (for students) */}
                        {auth.user?.role === 'student' && matchDetail && (
                            <MatchingScoreBreakdown detail={matchDetail} />
                        )}

                        {/* Company manage (for company role) */}
                        {auth.user?.role === 'company' && (
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.72)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.85)',
                                    borderRadius: '1.25rem',
                                    padding: '1.25rem 1.5rem',
                                    boxShadow: '0 4px 24px rgba(30,64,175,0.07)',
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 600,
                                        color: '#0F172A',
                                        fontSize: '1rem',
                                        marginBottom: '0.75rem',
                                    }}
                                >
                                    Manage Offer
                                </h2>
                                <Link
                                    href={`/offers/${offer.id}/edit`}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        background: 'rgba(219,234,254,0.6)',
                                        color: '#1E40AF',
                                        border: '1px solid rgba(147,197,253,0.5)',
                                        borderRadius: '0.625rem',
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        transition: 'background 200ms',
                                    }}
                                    className="hover:bg-blue-100/60"
                                >
                                    Edit Offer
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
