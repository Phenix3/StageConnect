import { Link } from '@inertiajs/react';
import { MapPin, Monitor } from 'lucide-react';
import { MatchScoreChips, type MatchDetail } from '@/components/matching-score-breakdown';

interface PublicOfferCardProps {
    offer: {
        id: number;
        title: string;
        city?: string;
        remote: boolean;
        type: string;
        level_required?: string;
        duration?: string;
        is_premium: boolean;
        company: { id: number; name: string; logo?: string };
        skills: { id: number; name: string }[];
    };
    matchScore?: number;
    scoreDetail?: MatchDetail;
    href: string;
    rightSlot?: React.ReactNode;
}

const TYPE_STYLES: Record<string, { background: string; color: string; border: string; label: string }> = {
    stage: {
        label: 'Internship',
        background: 'rgba(219,234,254,0.85)',
        color: '#1E40AF',
        border: '1px solid rgba(147,197,253,0.5)',
    },
    alternance: {
        label: 'Apprenticeship',
        background: 'rgba(237,233,254,0.85)',
        color: '#5B21B6',
        border: '1px solid rgba(196,181,253,0.5)',
    },
    emploi: {
        label: 'Job',
        background: 'rgba(209,250,229,0.85)',
        color: '#065F46',
        border: '1px solid rgba(110,231,183,0.5)',
    },
};

function CompanyAvatar({ name, logo }: { name: string; logo?: string }) {
    if (logo) {
        return (
            <img
                src={logo}
                alt={name}
                style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    objectFit: 'cover',
                    border: '1px solid rgba(219,234,254,0.8)',
                    flexShrink: 0,
                }}
            />
        );
    }
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    return (
        <div
            style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.625rem',
                background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
                color: '#1E40AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
}

export default function PublicOfferCard({ offer, matchScore, scoreDetail, href, rightSlot }: PublicOfferCardProps) {
    const typeStyle = TYPE_STYLES[offer.type] ?? {
        label: offer.type,
        background: 'rgba(241,245,249,0.85)',
        color: '#475569',
        border: '1px solid rgba(203,213,225,0.5)',
    };

    return (
        <Link
            href={href}
            className="group"
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: offer.is_premium
                    ? '1px solid rgba(251,191,36,0.5)'
                    : '1px solid rgba(255,255,255,0.85)',
                borderRadius: '1.25rem',
                padding: '1.25rem',
                boxShadow: offer.is_premium
                    ? '0 4px 24px rgba(251,191,36,0.1)'
                    : '0 4px 24px rgba(30,64,175,0.07)',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 40px rgba(30,64,175,0.14)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = offer.is_premium
                    ? '0 4px 24px rgba(251,191,36,0.1)'
                    : '0 4px 24px rgba(30,64,175,0.07)';
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
                    <CompanyAvatar name={offer.company.name} logo={offer.company.logo} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {offer.company.name}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                    {rightSlot}
                    {typeof matchScore === 'number' && (
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                                color: 'white',
                                borderRadius: '2rem',
                                padding: '0.125rem 0.625rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                            }}
                        >
                            {matchScore.toFixed(0)}% match
                        </span>
                    )}
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
                </div>
            </div>

            {/* Title */}
            <h3
                className="group-hover:!text-blue-700"
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    color: '#0F172A',
                    lineHeight: 1.35,
                    marginBottom: '0.625rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    transition: 'color 200ms',
                }}
            >
                {offer.title}
            </h3>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {(offer.city || offer.remote) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: '#64748B' }}>
                        {offer.remote
                            ? <Monitor size={12} />
                            : <MapPin size={12} />
                        }
                        {offer.remote ? 'Remote' : offer.city}
                    </span>
                )}
                {offer.level_required && (
                    <span
                        style={{
                            background: 'rgba(239,246,255,0.9)',
                            color: '#1E40AF',
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                        }}
                    >
                        {offer.level_required.toUpperCase()}
                    </span>
                )}
                {offer.duration && (
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>{offer.duration}</span>
                )}
            </div>

            {/* Skills */}
            <div style={{ marginTop: 'auto' }}>
                {offer.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {offer.skills.slice(0, 4).map((s) => (
                            <span
                                key={s.id}
                                style={{
                                    background: 'rgba(219,234,254,0.6)',
                                    color: '#1E40AF',
                                    border: '1px solid rgba(147,197,253,0.4)',
                                    borderRadius: '2rem',
                                    padding: '0.125rem 0.625rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                }}
                            >
                                {s.name}
                            </span>
                        ))}
                        {offer.skills.length > 4 && (
                            <span style={{ fontSize: '0.75rem', color: '#64748B', alignSelf: 'center' }}>
                                +{offer.skills.length - 4}
                            </span>
                        )}
                    </div>
                )}
                {scoreDetail && <MatchScoreChips detail={scoreDetail} />}
            </div>
        </Link>
    );
}
