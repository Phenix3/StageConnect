import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    GraduationCap,
    MapPin,
    MessageSquare,
    Search,
    Shield,
    Star,
    TrendingUp,
    Users,
    Zap,
} from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<{ auth: { user?: { role?: string } } }>().props;
    const isLoggedIn = !!auth.user;

    return (
        <>
            <Head title="StageConnect — Find your perfect internship">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Space+Grotesk:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    @media (prefers-reduced-motion: reduce) {
                        * { transition: none !important; animation: none !important; }
                    }
                `}</style>
            </Head>

            <div
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: '100vh',
                    overflowX: 'hidden',
                    background: 'linear-gradient(150deg, #EFF6FF 0%, #DBEAFE 40%, #E0F2FE 70%, #F0FDF4 100%)',
                    color: '#1E3A8A',
                }}
            >
                {/* ─── Floating Navbar ─── */}
                <nav
                    style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        right: '1rem',
                        zIndex: 50,
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        background: 'rgba(255, 255, 255, 0.88)',
                        border: '1px solid rgba(255, 255, 255, 0.7)',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 32px rgba(30, 64, 175, 0.1)',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            padding: '0 1.5rem',
                            height: '3.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '1.375rem',
                                fontWeight: 700,
                                color: '#0F172A',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Stage<span style={{ color: '#3B82F6' }}>Connect</span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Link
                                href="/offers"
                                style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', textDecoration: 'none', transition: 'color 200ms', cursor: 'pointer' }}
                                className="hover:text-blue-700"
                            >
                                Browse Offers
                            </Link>
                            <a
                                href="#pricing"
                                style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', textDecoration: 'none', transition: 'color 200ms', cursor: 'pointer' }}
                                className="hover:text-blue-700"
                            >
                                Pricing
                            </a>

                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.375rem',
                                        backgroundColor: '#1E40AF',
                                        color: 'white',
                                        padding: '0.5rem 1.125rem',
                                        borderRadius: '0.625rem',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        textDecoration: 'none',
                                        transition: 'opacity 200ms',
                                        cursor: 'pointer',
                                    }}
                                    className="hover:opacity-85"
                                >
                                    Dashboard <ArrowRight size={14} />
                                </Link>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Link
                                        href="/login"
                                        style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', textDecoration: 'none', transition: 'color 200ms', cursor: 'pointer' }}
                                        className="hover:text-blue-700"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href="/register"
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.375rem',
                                                backgroundColor: '#1E40AF',
                                                color: 'white',
                                                padding: '0.5rem 1.125rem',
                                                borderRadius: '0.625rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                                transition: 'opacity 200ms',
                                                cursor: 'pointer',
                                            }}
                                            className="hover:opacity-85"
                                        >
                                            Get started <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ─── Hero ─── */}
                <section
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '9rem 1.5rem 6rem',
                        textAlign: 'center',
                    }}
                >
                    {/* Badge */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backdropFilter: 'blur(8px)',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '9999px',
                            padding: '0.375rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: '#1E40AF',
                            marginBottom: '2rem',
                        }}
                    >
                        <Zap size={13} fill="#3B82F6" color="#3B82F6" />
                        AI-powered matching for students &amp; companies
                    </div>

                    {/* Headline */}
                    <h1
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                            fontWeight: 700,
                            lineHeight: 1.08,
                            marginBottom: '1.5rem',
                            color: '#0F172A',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Find your perfect
                        <br />
                        <span style={{ color: '#1E40AF' }}>internship</span>{' '}
                        <span style={{ color: '#94A3B8', fontWeight: 500 }}>or</span>{' '}
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            apprenticeship
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        style={{
                            fontSize: '1.2rem',
                            lineHeight: 1.65,
                            color: '#475569',
                            maxWidth: '580px',
                            margin: '0 auto 2.5rem',
                        }}
                    >
                        StageConnect scores every offer against your skills, location, availability and more — so you only see opportunities that truly fit.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {canRegister && !isLoggedIn && (
                            <Link
                                href="/register"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: '#22C55E',
                                    color: 'white',
                                    padding: '0.875rem 2rem',
                                    borderRadius: '0.875rem',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    boxShadow: '0 8px 28px rgba(34, 197, 94, 0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 200ms',
                                }}
                                className="hover:opacity-90 hover:scale-105"
                            >
                                Start for free <ArrowRight size={18} />
                            </Link>
                        )}
                        <Link
                            href="/offers"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                backdropFilter: 'blur(8px)',
                                background: 'rgba(255, 255, 255, 0.85)',
                                border: '1.5px solid rgba(30, 64, 175, 0.2)',
                                color: '#1E40AF',
                                padding: '0.875rem 2rem',
                                borderRadius: '0.875rem',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 200ms',
                            }}
                            className="hover:bg-blue-50 hover:border-blue-400"
                        >
                            <Search size={18} /> Browse offers
                        </Link>
                    </div>

                    {/* Stats row */}
                    <div
                        style={{
                            marginTop: '4rem',
                            display: 'inline-flex',
                            gap: '0',
                            backdropFilter: 'blur(12px)',
                            background: 'rgba(255, 255, 255, 0.72)',
                            border: '1.5px solid rgba(255, 255, 255, 0.8)',
                            borderRadius: '1.25rem',
                            boxShadow: '0 4px 24px rgba(30, 64, 175, 0.08)',
                            padding: '0',
                            overflow: 'hidden',
                            flexWrap: 'wrap',
                        }}
                    >
                        {[
                            { value: '5,000+', label: 'Students' },
                            { value: '800+', label: 'Companies' },
                            { value: '2,400+', label: 'Offers' },
                            { value: '92%', label: 'Match Rate' },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                style={{
                                    padding: '1.25rem 2rem',
                                    textAlign: 'center',
                                    borderRight: i < 3 ? '1px solid rgba(30, 64, 175, 0.1)' : 'none',
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#1E40AF',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.125rem' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── How it works ─── */}
                <section style={{ padding: '5rem 1.5rem' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                How it works
                            </h2>
                            <p style={{ color: '#475569', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
                                Get matched with the right opportunity in 3 simple steps
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                            {[
                                {
                                    step: '01',
                                    icon: <GraduationCap size={26} color="#1E40AF" />,
                                    iconBg: '#DBEAFE',
                                    borderColor: 'rgba(59, 130, 246, 0.2)',
                                    title: 'Create your profile',
                                    desc: 'Add your skills, study level, city, languages and availability. Upload your CV once — it\'s your passport to every application.',
                                },
                                {
                                    step: '02',
                                    icon: <Zap size={26} color="#7C3AED" />,
                                    iconBg: '#EDE9FE',
                                    borderColor: 'rgba(124, 58, 237, 0.2)',
                                    title: 'Get smart matches',
                                    desc: 'Our algorithm scores offers against your profile: skills (40%), level (25%), location (20%), languages (10%), availability (5%).',
                                },
                                {
                                    step: '03',
                                    icon: <CheckCircle size={26} color="#16A34A" />,
                                    iconBg: '#DCFCE7',
                                    borderColor: 'rgba(34, 197, 94, 0.2)',
                                    title: 'Apply &amp; get hired',
                                    desc: 'Apply with your cover letter, message companies directly, and track every application status — all from one dashboard.',
                                },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    style={{
                                        backdropFilter: 'blur(12px)',
                                        background: 'rgba(255, 255, 255, 0.78)',
                                        border: `1.5px solid ${item.borderColor}`,
                                        borderRadius: '1.25rem',
                                        padding: '2rem',
                                        position: 'relative',
                                        boxShadow: '0 4px 24px rgba(30, 64, 175, 0.06)',
                                        transition: 'transform 200ms, box-shadow 200ms',
                                    }}
                                    className="hover:scale-[1.02] hover:shadow-lg"
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '1.25rem',
                                            right: '1.5rem',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: '3.5rem',
                                            fontWeight: 800,
                                            color: 'rgba(30, 64, 175, 0.07)',
                                            lineHeight: 1,
                                            userSelect: 'none',
                                        }}
                                    >
                                        {item.step}
                                    </div>
                                    <div
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '0.75rem',
                                            backgroundColor: item.iconBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1.25rem',
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '1.1rem',
                                            color: '#0F172A',
                                            marginBottom: '0.625rem',
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}
                                       dangerouslySetInnerHTML={{ __html: item.desc }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Features grid ─── */}
                <section style={{ padding: '5rem 1.5rem' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Everything you need
                            </h2>
                            <p style={{ color: '#475569', maxWidth: '460px', margin: '0 auto', lineHeight: 1.6 }}>
                                Powerful tools for students and companies alike
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            {[
                                {
                                    icon: <TrendingUp size={22} color="#1E40AF" />,
                                    iconBg: '#DBEAFE',
                                    cardBg: 'rgba(239, 246, 255, 0.85)',
                                    title: 'Smart Matching',
                                    desc: 'Weighted scoring across 5 criteria so you only see the opportunities that truly match your profile.',
                                },
                                {
                                    icon: <MessageSquare size={22} color="#7C3AED" />,
                                    iconBg: '#EDE9FE',
                                    cardBg: 'rgba(245, 243, 255, 0.85)',
                                    title: 'Direct Messaging',
                                    desc: 'One thread per application — communicate with companies without leaving the platform.',
                                },
                                {
                                    icon: <Star size={22} color="#D97706" />,
                                    iconBg: '#FEF3C7',
                                    cardBg: 'rgba(255, 251, 235, 0.85)',
                                    title: 'Verified Reviews',
                                    desc: 'After every accepted internship, both parties review each other — building trusted reputation.',
                                },
                                {
                                    icon: <Shield size={22} color="#16A34A" />,
                                    iconBg: '#DCFCE7',
                                    cardBg: 'rgba(240, 253, 244, 0.85)',
                                    title: 'Secure CV Storage',
                                    desc: 'Upload your CV once. Shared only with companies you apply to — never publicly exposed.',
                                },
                                {
                                    icon: <MapPin size={22} color="#DC2626" />,
                                    iconBg: '#FEE2E2',
                                    cardBg: 'rgba(255, 241, 242, 0.85)',
                                    title: 'Location Matching',
                                    desc: 'Filter by city or remote. The algorithm automatically boosts offers matching your preferred location.',
                                },
                                {
                                    icon: <Users size={22} color="#0891B2" />,
                                    iconBg: '#CFFAFE',
                                    cardBg: 'rgba(236, 254, 255, 0.85)',
                                    title: 'Company Profiles',
                                    desc: 'Discover companies with verified profiles — sector, size, open offers and intern reviews.',
                                },
                            ].map((f) => (
                                <div
                                    key={f.title}
                                    style={{
                                        backdropFilter: 'blur(12px)',
                                        background: f.cardBg,
                                        border: '1.5px solid rgba(255, 255, 255, 0.75)',
                                        borderRadius: '1.25rem',
                                        padding: '1.75rem',
                                        boxShadow: '0 2px 16px rgba(30, 64, 175, 0.05)',
                                        transition: 'transform 200ms, box-shadow 200ms',
                                        cursor: 'default',
                                    }}
                                    className="hover:scale-[1.02] hover:shadow-md"
                                >
                                    <div
                                        style={{
                                            width: '2.625rem',
                                            height: '2.625rem',
                                            borderRadius: '0.625rem',
                                            backgroundColor: f.iconBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1rem',
                                        }}
                                    >
                                        {f.icon}
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            color: '#0F172A',
                                            marginBottom: '0.5rem',
                                        }}
                                    >
                                        {f.title}
                                    </h3>
                                    <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Pricing ─── */}
                <section id="pricing" style={{ padding: '5rem 1.5rem' }}>
                    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Simple pricing for companies
                            </h2>
                            <p style={{ color: '#475569', maxWidth: '420px', margin: '0 auto', lineHeight: 1.6 }}>
                                Students are always free. Companies choose the plan that fits their hiring needs.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
                            {/* Free */}
                            <PricingCard
                                tier="Free"
                                price="€0"
                                period="forever"
                                features={['1 active offer', 'Basic company profile', 'Application management', 'Email notifications']}
                                ctaLabel="Get started free"
                                ctaHref={canRegister && !isLoggedIn ? '/register' : null}
                                variant="outline"
                            />

                            {/* Starter */}
                            <PricingCard
                                tier="Starter"
                                price="€49"
                                period="per month"
                                features={['Up to 5 active offers', 'Priority in search results', 'Application analytics', 'Direct messaging', 'Email support']}
                                ctaLabel="Start with Starter"
                                ctaHref={canRegister && !isLoggedIn ? '/register' : null}
                                variant="featured"
                                badge="POPULAR"
                            />

                            {/* Pro */}
                            <PricingCard
                                tier="Pro"
                                price="€149"
                                period="per month"
                                features={['Unlimited offers', 'Top placement + featured badge', 'Advanced analytics', 'API access', 'Dedicated account manager', 'Priority support']}
                                ctaLabel="Go Pro"
                                ctaHref={canRegister && !isLoggedIn ? '/register' : null}
                                variant="outline"
                            />
                        </div>
                    </div>
                </section>

                {/* ─── Testimonials ─── */}
                <section style={{ padding: '5rem 1.5rem' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2
                                style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                    fontWeight: 700,
                                    color: '#0F172A',
                                    marginBottom: '0.75rem',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                What people say
                            </h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                            {[
                                {
                                    quote: 'Found my dream startup internship in 3 days. The 94% match score was spot on — exactly the stack I wanted to work with.',
                                    name: 'Amina K.',
                                    role: 'Computer Science student, Paris',
                                    rating: 5,
                                    initials: 'AK',
                                    avatarBg: '#DBEAFE',
                                    avatarColor: '#1E40AF',
                                },
                                {
                                    quote: "We've hired 4 interns through StageConnect. The pre-screening by match score saves our HR team hours every week.",
                                    name: 'Thomas R.',
                                    role: 'CTO, TechFlow SAS',
                                    rating: 5,
                                    initials: 'TR',
                                    avatarBg: '#EDE9FE',
                                    avatarColor: '#7C3AED',
                                },
                                {
                                    quote: 'The direct messaging feature is a game-changer. No more email chaos — everything is in one thread per candidate.',
                                    name: 'Sarah M.',
                                    role: 'HR Manager, DataViz Corp',
                                    rating: 5,
                                    initials: 'SM',
                                    avatarBg: '#DCFCE7',
                                    avatarColor: '#16A34A',
                                },
                            ].map((t) => (
                                <div
                                    key={t.name}
                                    style={{
                                        backdropFilter: 'blur(12px)',
                                        background: 'rgba(255, 255, 255, 0.78)',
                                        border: '1.5px solid rgba(255, 255, 255, 0.8)',
                                        borderRadius: '1.25rem',
                                        padding: '2rem',
                                        boxShadow: '0 4px 24px rgba(30, 64, 175, 0.06)',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                                        {Array.from({ length: t.rating }).map((_, i) => (
                                            <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                                        ))}
                                    </div>
                                    <p
                                        style={{
                                            color: '#334155',
                                            fontSize: '0.95rem',
                                            lineHeight: 1.7,
                                            marginBottom: '1.5rem',
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        &ldquo;{t.quote}&rdquo;
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div
                                            style={{
                                                width: '2.5rem',
                                                height: '2.5rem',
                                                borderRadius: '9999px',
                                                backgroundColor: t.avatarBg,
                                                color: t.avatarColor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {t.initials}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0F172A' }}>{t.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── Final CTA ─── */}
                {!isLoggedIn && canRegister && (
                    <section style={{ padding: '5rem 1.5rem' }}>
                        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                            <div
                                style={{
                                    backdropFilter: 'blur(16px)',
                                    background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.94) 0%, rgba(59, 130, 246, 0.9) 100%)',
                                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                                    borderRadius: '2rem',
                                    padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
                                    textAlign: 'center',
                                    boxShadow: '0 24px 64px rgba(30, 64, 175, 0.35)',
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                                        fontWeight: 700,
                                        color: 'white',
                                        marginBottom: '1rem',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Ready to find your match?
                                </h2>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.8)',
                                        maxWidth: '420px',
                                        margin: '0 auto 2.5rem',
                                        lineHeight: 1.65,
                                        fontSize: '1rem',
                                    }}
                                >
                                    Join thousands of students and companies already finding their perfect fit on StageConnect.
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Link
                                        href="/register"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            backgroundColor: '#22C55E',
                                            color: 'white',
                                            padding: '0.875rem 2rem',
                                            borderRadius: '0.875rem',
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            boxShadow: '0 8px 28px rgba(34, 197, 94, 0.45)',
                                            cursor: 'pointer',
                                            transition: 'all 200ms',
                                        }}
                                        className="hover:opacity-90 hover:scale-105"
                                    >
                                        <GraduationCap size={18} /> I&apos;m a student
                                    </Link>
                                    <Link
                                        href="/register"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(8px)',
                                            border: '1.5px solid rgba(255,255,255,0.4)',
                                            color: 'white',
                                            padding: '0.875rem 2rem',
                                            borderRadius: '0.875rem',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 200ms',
                                        }}
                                        className="hover:bg-white/20"
                                    >
                                        <Briefcase size={18} /> I&apos;m a company
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── Footer ─── */}
                <footer
                    style={{
                        borderTop: '1px solid rgba(30, 64, 175, 0.1)',
                        padding: '2.5rem 1.5rem',
                        marginTop: '2rem',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1200px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1.25rem',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: '1.125rem',
                                color: '#0F172A',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Stage<span style={{ color: '#3B82F6' }}>Connect</span>
                        </span>

                        <div style={{ display: 'flex', gap: '1.75rem', flexWrap: 'wrap' }}>
                            {[
                                { label: 'Browse Offers', href: '/offers' },
                                { label: 'Log in', href: '/login' },
                                ...(canRegister ? [{ label: 'Register', href: '/register' }] : []),
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    style={{
                                        color: '#64748B',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'color 200ms',
                                    }}
                                    className="hover:text-blue-700"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>© 2026 StageConnect. All rights reserved.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}

/* ─── Sub-components ─── */

interface PricingCardProps {
    tier: string;
    price: string;
    period: string;
    features: string[];
    ctaLabel: string;
    ctaHref: string | null;
    variant: 'outline' | 'featured';
    badge?: string;
}

function PricingCard({ tier, price, period, features, ctaLabel, ctaHref, variant, badge }: PricingCardProps) {
    const isFeatured = variant === 'featured';

    return (
        <div
            style={{
                backdropFilter: 'blur(12px)',
                background: isFeatured
                    ? 'linear-gradient(140deg, rgba(30, 64, 175, 0.93) 0%, rgba(59, 130, 246, 0.9) 100%)'
                    : 'rgba(255, 255, 255, 0.78)',
                border: isFeatured ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid rgba(30, 64, 175, 0.15)',
                borderRadius: '1.25rem',
                padding: '2rem',
                boxShadow: isFeatured ? '0 12px 48px rgba(30, 64, 175, 0.35)' : '0 4px 24px rgba(30, 64, 175, 0.06)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {badge && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-0.75rem',
                        right: '1.5rem',
                        backgroundColor: '#22C55E',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.05em',
                    }}
                >
                    {badge}
                </div>
            )}

            <div
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: isFeatured ? 'rgba(255,255,255,0.7)' : '#64748B',
                    marginBottom: '0.5rem',
                }}
            >
                {tier}
            </div>

            <div
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: isFeatured ? 'white' : '#0F172A',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                }}
            >
                {price}
            </div>
            <div style={{ fontSize: '0.85rem', color: isFeatured ? 'rgba(255,255,255,0.6)' : '#64748B', marginBottom: '1.75rem' }}>
                {period}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
                {features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: isFeatured ? 'rgba(255,255,255,0.9)' : '#334155' }}>
                        <CheckCircle size={15} color={isFeatured ? 'white' : '#22C55E'} style={{ flexShrink: 0 }} />
                        {f}
                    </li>
                ))}
            </ul>

            {ctaHref && (
                <Link
                    href={ctaHref}
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        cursor: 'pointer',
                        transition: 'all 200ms',
                        ...(isFeatured
                            ? { backgroundColor: 'white', color: '#1E40AF' }
                            : { border: '1.5px solid #1E40AF', color: '#1E40AF', background: 'transparent' }),
                    }}
                    className={isFeatured ? 'hover:opacity-90' : 'hover:bg-blue-50'}
                >
                    {ctaLabel}
                </Link>
            )}
        </div>
    );
}
