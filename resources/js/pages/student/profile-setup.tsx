import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PublicLayout from '@/layouts/public-layout';

interface Skill {
    id: number;
    name: string;
    slug: string;
}

interface StudentProfile {
    bio?: string;
    level?: string;
    school?: string;
    city?: string;
    languages?: string[];
    cv_path?: string;
    availability_from?: string;
    availability_to?: string;
    skills?: Skill[];
}

interface Props {
    profile?: StudentProfile;
    skills: Skill[];
}

const LEVELS = ['bac', 'bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5', 'bac+8'];
const LANGUAGES = ['French', 'English', 'Spanish', 'Arabic', 'German', 'Portuguese'];

const LABEL_STYLE: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    color: '#0F172A',
    fontSize: '0.875rem',
    display: 'block',
    marginBottom: '0.375rem',
};

const SECTION_HEADING: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    color: '#1E40AF',
    fontSize: '0.9375rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(219,234,254,0.8)',
};

const DIVIDER: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid rgba(219,234,254,0.8)',
    margin: '1.5rem 0',
};

export default function StudentProfileSetup({ profile, skills }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        bio: profile?.bio ?? '',
        level: profile?.level ?? '',
        school: profile?.school ?? '',
        city: profile?.city ?? '',
        languages: profile?.languages ?? [] as string[],
        availability_from: profile?.availability_from ?? '',
        availability_to: profile?.availability_to ?? '',
        skill_ids: profile?.skills?.map((s) => s.id) ?? [] as number[],
        cv: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/student/profile', { forceFormData: true });
    }

    function toggleSkill(id: number) {
        setData('skill_ids', data.skill_ids.includes(id)
            ? data.skill_ids.filter((s) => s !== id)
            : [...data.skill_ids, id]);
    }

    function toggleLanguage(lang: string) {
        setData('languages', data.languages.includes(lang)
            ? data.languages.filter((l) => l !== lang)
            : [...data.languages, lang]);
    }

    const inputClass = 'bg-white/90 border-blue-200 focus:border-blue-400 focus:ring-blue-100';

    const selectStyle: React.CSSProperties = {
        width: '100%',
        height: '2.5rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(147,197,253,0.5)',
        background: 'rgba(255,255,255,0.9)',
        padding: '0 0.75rem',
        fontSize: '0.875rem',
        color: '#0F172A',
        outline: 'none',
        cursor: 'pointer',
    };

    return (
        <PublicLayout title="Profile Setup" activeNav={null}>
            <Head title="Profile Setup" />

            <div style={{ paddingTop: '1rem', paddingBottom: '2rem', maxWidth: '40rem' }}>

                {/* Page header */}
                <div style={{ marginBottom: '1.75rem' }}>
                    <h1
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                            fontWeight: 700,
                            color: '#0F172A',
                            letterSpacing: '-0.02em',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Complete Your Profile
                    </h1>
                    <p style={{ color: '#64748B', fontSize: '1rem' }}>
                        Help companies find you with the right information.
                    </p>
                </div>

                {/* Form card */}
                <div
                    style={{
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.95)',
                        borderRadius: '1.5rem',
                        borderTop: '3px solid #3B82F6',
                        padding: '2rem',
                        boxShadow: '0 8px 48px rgba(30,64,175,0.1)',
                    }}
                >
                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }} encType="multipart/form-data">

                        {/* ─── Section 1 : About ─── */}
                        <p style={SECTION_HEADING}>About You</p>

                        {/* Bio */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={LABEL_STYLE} htmlFor="bio">Bio</label>
                            <Textarea
                                id="bio"
                                value={data.bio}
                                onChange={(e) => setData('bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className={inputClass}
                            />
                            <InputError message={errors.bio} />
                        </div>

                        {/* Level */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={LABEL_STYLE} htmlFor="level">Education Level</label>
                            <select
                                id="level"
                                value={data.level}
                                onChange={(e) => setData('level', e.target.value)}
                                style={selectStyle}
                            >
                                <option value="">Select level...</option>
                                {LEVELS.map((l) => (
                                    <option key={l} value={l}>{l.toUpperCase()}</option>
                                ))}
                            </select>
                            <InputError message={errors.level} />
                        </div>

                        {/* School */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={LABEL_STYLE} htmlFor="school">School / University</label>
                            <Input
                                id="school"
                                value={data.school}
                                onChange={(e) => setData('school', e.target.value)}
                                placeholder="Your school name"
                                className={inputClass}
                            />
                            <InputError message={errors.school} />
                        </div>

                        {/* City */}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={LABEL_STYLE} htmlFor="city">City</label>
                            <Input
                                id="city"
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                                placeholder="Your city"
                                className={inputClass}
                            />
                            <InputError message={errors.city} />
                        </div>

                        <hr style={DIVIDER} />

                        {/* ─── Section 2 : Skills & Languages ─── */}
                        <p style={SECTION_HEADING}>Skills &amp; Languages</p>

                        {/* Languages */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={LABEL_STYLE}>Languages</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {LANGUAGES.map((lang) => {
                                    const selected = data.languages.includes(lang);
                                    return (
                                        <button
                                            key={lang}
                                            type="button"
                                            onClick={() => toggleLanguage(lang)}
                                            style={{
                                                borderRadius: '2rem',
                                                padding: '0.375rem 1rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                border: selected ? 'none' : '1px solid rgba(147,197,253,0.5)',
                                                background: selected
                                                    ? 'linear-gradient(135deg, #1E40AF, #3B82F6)'
                                                    : 'rgba(255,255,255,0.7)',
                                                color: selected ? 'white' : '#334155',
                                                boxShadow: selected ? '0 2px 8px rgba(30,64,175,0.3)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'all 150ms ease',
                                            }}
                                        >
                                            {lang}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.languages} />
                        </div>

                        {/* Skills */}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={LABEL_STYLE}>Skills</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {skills.map((skill) => {
                                    const selected = data.skill_ids.includes(skill.id);
                                    return (
                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() => toggleSkill(skill.id)}
                                            style={{
                                                borderRadius: '2rem',
                                                padding: '0.375rem 1rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                border: selected ? 'none' : '1px solid rgba(147,197,253,0.5)',
                                                background: selected
                                                    ? 'linear-gradient(135deg, #1E40AF, #3B82F6)'
                                                    : 'rgba(255,255,255,0.7)',
                                                color: selected ? 'white' : '#334155',
                                                boxShadow: selected ? '0 2px 8px rgba(30,64,175,0.3)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'all 150ms ease',
                                            }}
                                        >
                                            {skill.name}
                                        </button>
                                    );
                                })}
                            </div>
                            <InputError message={errors.skill_ids} />
                        </div>

                        <hr style={DIVIDER} />

                        {/* ─── Section 3 : Availability & CV ─── */}
                        <p style={SECTION_HEADING}>Availability &amp; CV</p>

                        {/* Availability dates */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={LABEL_STYLE} htmlFor="availability_from">Available from</label>
                                <Input
                                    id="availability_from"
                                    type="date"
                                    value={data.availability_from}
                                    onChange={(e) => setData('availability_from', e.target.value)}
                                    className={inputClass}
                                />
                                <InputError message={errors.availability_from} />
                            </div>
                            <div>
                                <label style={LABEL_STYLE} htmlFor="availability_to">Available until</label>
                                <Input
                                    id="availability_to"
                                    type="date"
                                    value={data.availability_to}
                                    onChange={(e) => setData('availability_to', e.target.value)}
                                    className={inputClass}
                                />
                                <InputError message={errors.availability_to} />
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label style={LABEL_STYLE} htmlFor="cv">CV <span style={{ fontWeight: 400, color: '#94A3B8' }}>(PDF, DOC, DOCX — max 5MB)</span></label>
                            {profile?.cv_path && (
                                <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '0.5rem' }}>
                                    Current CV uploaded. Upload a new one to replace it.
                                </p>
                            )}
                            <Input
                                id="cv"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setData('cv', e.target.files?.[0] ?? null)}
                                className={inputClass}
                            />
                            <InputError message={errors.cv} />
                        </div>

                        <hr style={DIVIDER} />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #1E40AF, #3B82F6)',
                                color: 'white',
                                padding: '0.875rem',
                                borderRadius: '0.875rem',
                                border: 'none',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 600,
                                fontSize: '1rem',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                opacity: processing ? 0.65 : 1,
                                transition: 'opacity 200ms',
                            }}
                            className="hover:opacity-85"
                        >
                            Save Profile
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
