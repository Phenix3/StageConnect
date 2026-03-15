import { Head, Link } from '@inertiajs/react';
import { BarChart2, Briefcase, Eye, TrendingUp, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Funnel {
    pending: number;
    accepted: number;
    rejected: number;
    withdrawn: number;
}

interface OfferStat {
    id: number;
    title: string;
    status: string;
    views_count: number;
    applications_count: number;
    avg_matching_score: number | null;
    funnel: Funnel;
}

interface Summary {
    total_views: number;
    total_applications: number;
    conversion_rate: number;
    avg_matching_score: number | null;
    total_offers: number;
    active_offers: number;
}

interface Props {
    offerStats: OfferStat[];
    summary: Summary;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Analytics', href: '/company/analytics' },
];

const CARD: React.CSSProperties = {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.85)',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(30,64,175,0.07)',
};

function KpiCard({ icon: Icon, label, value, sub, color }: {
    icon: React.ElementType;
    label: string;
    value: string;
    sub?: string;
    color: string;
}) {
    return (
        <div style={{ ...CARD, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div
                style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.75rem',
                    background: color + '22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                <Icon size={18} style={{ color }} />
            </div>
            <div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 500, marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                    {value}
                </div>
                {sub && <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>{sub}</div>}
            </div>
        </div>
    );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '0.375rem', borderRadius: '999px', background: 'rgba(203,213,225,0.4)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color, minWidth: '1.75rem', textAlign: 'right' }}>{value}</span>
        </div>
    );
}

function ScoreBadge({ score }: { score: number | null }) {
    if (score === null) return <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>—</span>;
    const color = score >= 70 ? '#10B981' : score >= 45 ? '#F59E0B' : '#EF4444';
    return (
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color }}>{score.toFixed(1)}%</span>
    );
}

export default function CompanyAnalytics({ offerStats, summary }: Props) {
    const maxViews = Math.max(...offerStats.map((o) => o.views_count), 1);
    const maxApps = Math.max(...offerStats.map((o) => o.applications_count), 1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics" />

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
                        Analytics
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
                        {summary.active_offers} active offer{summary.active_offers !== 1 ? 's' : ''} · {summary.total_offers} total
                    </p>
                </div>

                {/* KPI cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard icon={Eye} label="Total Views" value={summary.total_views.toLocaleString()} color="#3B82F6" />
                    <KpiCard icon={Users} label="Total Applications" value={summary.total_applications.toLocaleString()} color="#8B5CF6" />
                    <KpiCard
                        icon={TrendingUp}
                        label="Conversion Rate"
                        value={`${summary.conversion_rate}%`}
                        sub="Applications / Views"
                        color="#10B981"
                    />
                    <KpiCard
                        icon={BarChart2}
                        label="Avg. Match Score"
                        value={summary.avg_matching_score !== null ? `${summary.avg_matching_score}%` : '—'}
                        sub="Across all applicants"
                        color="#F59E0B"
                    />
                </div>

                {/* Per-offer table */}
                {offerStats.length === 0 ? (
                    <div style={{ ...CARD, textAlign: 'center', padding: '3rem' }}>
                        <Briefcase size={40} style={{ color: '#3B82F6', opacity: 0.35, margin: '0 auto 0.75rem' }} />
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: '#0F172A', fontSize: '1rem', marginBottom: '0.5rem' }}>
                            No offers yet
                        </p>
                        <Link
                            href="/offers/create"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#1E40AF',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '0.625rem',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            Create your first offer
                        </Link>
                    </div>
                ) : (
                    <div style={CARD}>
                        <h2
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 600,
                                color: '#0F172A',
                                fontSize: '1rem',
                                marginBottom: '1.25rem',
                            }}
                        >
                            Offer Performance
                        </h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr>
                                        {['Offer', 'Status', 'Views', 'Applications', 'Avg. Score', 'Funnel'].map((h) => (
                                            <th
                                                key={h}
                                                style={{
                                                    textAlign: 'left',
                                                    padding: '0.5rem 0.75rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    color: '#64748B',
                                                    borderBottom: '1px solid rgba(203,213,225,0.4)',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {offerStats.map((stat, i) => (
                                        <tr
                                            key={stat.id}
                                            style={{
                                                borderBottom: i < offerStats.length - 1 ? '1px solid rgba(203,213,225,0.25)' : 'none',
                                            }}
                                        >
                                            {/* Title */}
                                            <td style={{ padding: '0.75rem', maxWidth: '14rem' }}>
                                                <Link
                                                    href={`/offers/${stat.id}`}
                                                    style={{
                                                        fontWeight: 500,
                                                        color: '#1E40AF',
                                                        textDecoration: 'none',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                    }}
                                                    className="hover:underline"
                                                >
                                                    {stat.title}
                                                </Link>
                                            </td>
                                            {/* Status */}
                                            <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                                                <span
                                                    style={{
                                                        background: stat.status === 'active' ? 'rgba(209,250,229,0.7)' : 'rgba(241,245,249,0.7)',
                                                        color: stat.status === 'active' ? '#065F46' : '#64748B',
                                                        borderRadius: '2rem',
                                                        padding: '0.125rem 0.625rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {stat.status}
                                                </span>
                                            </td>
                                            {/* Views */}
                                            <td style={{ padding: '0.75rem', minWidth: '7rem' }}>
                                                <MiniBar value={stat.views_count} max={maxViews} color="#3B82F6" />
                                            </td>
                                            {/* Applications */}
                                            <td style={{ padding: '0.75rem', minWidth: '7rem' }}>
                                                <MiniBar value={stat.applications_count} max={maxApps} color="#8B5CF6" />
                                            </td>
                                            {/* Avg score */}
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <ScoreBadge score={stat.avg_matching_score} />
                                            </td>
                                            {/* Funnel chips */}
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                    {stat.funnel.pending > 0 && (
                                                        <span style={{ background: 'rgba(254,243,199,0.7)', color: '#92400E', borderRadius: '0.375rem', padding: '0.125rem 0.375rem', fontSize: '0.6875rem', fontWeight: 600 }}>
                                                            {stat.funnel.pending} pending
                                                        </span>
                                                    )}
                                                    {stat.funnel.accepted > 0 && (
                                                        <span style={{ background: 'rgba(209,250,229,0.7)', color: '#065F46', borderRadius: '0.375rem', padding: '0.125rem 0.375rem', fontSize: '0.6875rem', fontWeight: 600 }}>
                                                            {stat.funnel.accepted} accepted
                                                        </span>
                                                    )}
                                                    {stat.funnel.rejected > 0 && (
                                                        <span style={{ background: 'rgba(254,226,226,0.7)', color: '#991B1B', borderRadius: '0.375rem', padding: '0.125rem 0.375rem', fontSize: '0.6875rem', fontWeight: 600 }}>
                                                            {stat.funnel.rejected} rejected
                                                        </span>
                                                    )}
                                                    {stat.funnel.withdrawn > 0 && (
                                                        <span style={{ background: 'rgba(241,245,249,0.7)', color: '#475569', borderRadius: '0.375rem', padding: '0.125rem 0.375rem', fontSize: '0.6875rem', fontWeight: 600 }}>
                                                            {stat.funnel.withdrawn} withdrawn
                                                        </span>
                                                    )}
                                                    {stat.applications_count === 0 && (
                                                        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>No applications</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
