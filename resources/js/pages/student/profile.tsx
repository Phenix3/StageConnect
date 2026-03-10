import { Head, Link } from '@inertiajs/react';
import { Calendar, MapPin } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import { edit as editStudentProfile } from '@/routes/student/profile';

interface Skill { id: number; name: string; }
interface StudentProfile {
    id: number;
    bio?: string;
    level?: string;
    school?: string;
    city?: string;
    languages?: string[];
    availability_from?: string;
    availability_to?: string;
    skills: Skill[];
    user: { name: string };
}
interface Props { student: StudentProfile; }

const CARD: React.CSSProperties = {
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.85)',
    borderRadius: '1.25rem',
    padding: '1.5rem',
    boxShadow: '0 4px 24px rgba(30,64,175,0.07)',
};

const SECTION_HEADING: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    color: '#0F172A',
    fontSize: '1rem',
    marginBottom: '0.875rem',
};

export default function StudentProfileView({ student }: Props) {
    const initials = student.user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
        <PublicLayout title={student.user.name} activeNav={null}>
            <Head title={student.user.name} />

            <div style={{ paddingTop: '1rem', paddingBottom: '2rem', maxWidth: '48rem' }}>

                {/* Profile header card */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.72)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.85)',
                        borderRadius: '1.25rem',
                        overflow: 'hidden',
                        boxShadow: '0 4px 24px rgba(30,64,175,0.09)',
                        marginBottom: '1.25rem',
                    }}
                >
                    {/* Blue gradient stripe */}
                    <div
                        style={{
                            height: '6rem',
                            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 60%, #0EA5E9 100%)',
                            position: 'relative',
                        }}
                    />

                    {/* Avatar overlapping the stripe */}
                    <div style={{ padding: '0 1.5rem 1.5rem' }}>
                        <div
                            style={{
                                width: '4.5rem',
                                height: '4.5rem',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
                                color: '#1E40AF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem',
                                fontWeight: 700,
                                border: '3px solid white',
                                boxShadow: '0 2px 12px rgba(30,64,175,0.15)',
                                marginTop: '-2.25rem',
                                marginBottom: '0.875rem',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                        >
                            {initials}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h1
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontWeight: 700,
                                        fontSize: '1.5rem',
                                        color: '#0F172A',
                                        letterSpacing: '-0.015em',
                                        marginBottom: '0.25rem',
                                    }}
                                >
                                    {student.user.name}
                                </h1>
                                {student.level && (
                                    <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>
                                        {student.level.toUpperCase()}
                                        {student.school ? ` · ${student.school}` : ''}
                                    </p>
                                )}
                                {student.city && (
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#64748B' }}>
                                        <MapPin size={13} /> {student.city}
                                    </p>
                                )}
                            </div>
                            <Link
                                href={editStudentProfile().url}
                                style={{
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
                                Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* About */}
                {student.bio && (
                    <div style={{ ...CARD, marginBottom: '1.25rem' }}>
                        <h2 style={SECTION_HEADING}>About</h2>
                        <p style={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '0.9375rem' }}>
                            {student.bio}
                        </p>
                    </div>
                )}

                {/* Skills */}
                {student.skills.length > 0 && (
                    <div style={{ ...CARD, marginBottom: '1.25rem' }}>
                        <h2 style={SECTION_HEADING}>Skills</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {student.skills.map((s) => (
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

                {/* Languages */}
                {student.languages && student.languages.length > 0 && (
                    <div style={{ ...CARD, marginBottom: '1.25rem' }}>
                        <h2 style={SECTION_HEADING}>Languages</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {student.languages.map((l) => (
                                <span
                                    key={l}
                                    style={{
                                        background: 'rgba(240,253,244,0.7)',
                                        color: '#065F46',
                                        border: '1px solid rgba(110,231,183,0.4)',
                                        borderRadius: '2rem',
                                        padding: '0.25rem 0.875rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    {l}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Availability */}
                {(student.availability_from || student.availability_to) && (
                    <div style={CARD}>
                        <h2 style={SECTION_HEADING}>Availability</h2>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.9375rem' }}>
                            <Calendar size={15} style={{ color: '#3B82F6' }} />
                            {student.availability_from && `From ${student.availability_from}`}
                            {student.availability_from && student.availability_to && ' to '}
                            {student.availability_to && student.availability_to}
                        </p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
