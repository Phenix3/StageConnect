import { Lightbulb } from 'lucide-react';

export interface ScoreCriterion {
    earned: number;
    max: number;
    raw: number;
    hint?: string | null;
}

export interface MatchDetail {
    total: number;
    skills: ScoreCriterion;
    level: ScoreCriterion;
    location: ScoreCriterion;
    languages: ScoreCriterion;
    availability: ScoreCriterion;
}

interface BarProps {
    label: string;
    criterion: ScoreCriterion;
}

function ScoreBar({ label, criterion }: BarProps) {
    const pct = criterion.max > 0 ? (criterion.earned / criterion.max) * 100 : 0;
    const color = pct >= 75 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#334155' }}>{label}</span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color }}>
                    {criterion.earned.toFixed(1)}/{criterion.max.toFixed(0)}
                </span>
            </div>
            <div
                style={{
                    height: '0.375rem',
                    borderRadius: '999px',
                    background: 'rgba(203,213,225,0.4)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: color,
                        borderRadius: '999px',
                        transition: 'width 400ms ease',
                    }}
                />
            </div>
            {criterion.hint && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem', marginTop: '0.125rem' }}>
                    <Lightbulb size={11} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.125rem' }} />
                    <span style={{ fontSize: '0.6875rem', color: '#64748B', lineHeight: 1.4 }}>{criterion.hint}</span>
                </div>
            )}
        </div>
    );
}

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 75 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444';
    const bg = score >= 75 ? 'rgba(209,250,229,0.7)' : score >= 50 ? 'rgba(254,243,199,0.7)' : 'rgba(254,226,226,0.7)';
    const border = score >= 75 ? 'rgba(110,231,183,0.5)' : score >= 50 ? 'rgba(252,211,77,0.5)' : 'rgba(252,165,165,0.5)';

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: '2rem',
                padding: '0.375rem 1rem',
            }}
        >
            <span
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color,
                    lineHeight: 1,
                }}
            >
                {score.toFixed(0)}%
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#64748B' }}>match</span>
        </div>
    );
}

interface Props {
    detail: MatchDetail;
}

export default function MatchingScoreBreakdown({ detail }: Props) {
    return (
        <div
            style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.9)',
                borderRadius: '1.25rem',
                borderTop: '3px solid #10B981',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 4px 24px rgba(16,185,129,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        color: '#0F172A',
                        fontSize: '1rem',
                        margin: 0,
                    }}
                >
                    Your Match Score
                </h3>
                <ScoreBadge score={detail.total} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <ScoreBar label="Skills" criterion={detail.skills} />
                <ScoreBar label="Level" criterion={detail.level} />
                <ScoreBar label="Location" criterion={detail.location} />
                <ScoreBar label="Languages" criterion={detail.languages} />
                <ScoreBar label="Availability" criterion={detail.availability} />
            </div>
        </div>
    );
}

/** Compact inline chips for cards */
export function MatchScoreChips({ detail }: { detail: MatchDetail }) {
    const criteria: [string, ScoreCriterion][] = [
        ['Skills', detail.skills],
        ['Level', detail.level],
        ['Location', detail.location],
        ['Lang', detail.languages],
        ['Avail.', detail.availability],
    ];

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
            {criteria.map(([label, c]) => {
                const pct = c.max > 0 ? (c.earned / c.max) * 100 : 0;
                const color = pct >= 75 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';
                const bg = pct >= 75 ? 'rgba(209,250,229,0.6)' : pct >= 40 ? 'rgba(254,243,199,0.6)' : 'rgba(254,226,226,0.6)';
                return (
                    <span
                        key={label}
                        style={{
                            background: bg,
                            color,
                            borderRadius: '0.375rem',
                            padding: '0.125rem 0.375rem',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {label} {c.earned.toFixed(0)}/{c.max.toFixed(0)}
                    </span>
                );
            })}
        </div>
    );
}
