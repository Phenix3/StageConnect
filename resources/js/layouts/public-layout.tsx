import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronDown, LayoutDashboard, LogOut, Settings, UserCircle } from 'lucide-react';
import { FlashMessages } from '@/components/flash-messages';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { dashboard, logout, register } from '@/routes';
import { edit as editStudentProfile } from '@/routes/student/profile';
import type { User } from '@/types';

interface PublicLayoutProps {
    children: React.ReactNode;
    title: string;
    activeNav?: 'offers' | 'recommended' | null;
}

const NAV_LINK_BASE: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#334155',
    textDecoration: 'none',
    transition: 'color 200ms',
    cursor: 'pointer',
    paddingBottom: '2px',
};

const NAV_LINK_ACTIVE: React.CSSProperties = {
    ...NAV_LINK_BASE,
    color: '#1E40AF',
    borderBottom: '2px solid #3B82F6',
};

export default function PublicLayout({ children, title, activeNav }: PublicLayoutProps) {
    const { auth } = usePage<{ auth: { user?: User } }>().props;
    const user = auth.user;

    return (
        <>
            <Head title={title}>
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
                            maxWidth: '80rem',
                            margin: '0 auto',
                            padding: '0 1.5rem',
                            height: '3.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* Logo */}
                        <Link
                            href="/"
                            style={{ textDecoration: 'none' }}
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
                        </Link>

                        {/* Centre nav + Right zone */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            {/* Nav links */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <Link
                                    href="/offers"
                                    style={activeNav === 'offers' ? NAV_LINK_ACTIVE : NAV_LINK_BASE}
                                    className={activeNav !== 'offers' ? 'hover:!text-blue-700' : ''}
                                >
                                    Browse Offers
                                </Link>
                                {user && (
                                    <Link
                                        href="/offers/recommended"
                                        style={activeNav === 'recommended' ? NAV_LINK_ACTIVE : NAV_LINK_BASE}
                                        className={activeNav !== 'recommended' ? 'hover:!text-blue-700' : ''}
                                    >
                                        Recommended
                                    </Link>
                                )}
                            </div>

                            {/* Auth zone */}
                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'rgba(255,255,255,0.6)',
                                                border: '1px solid rgba(255,255,255,0.8)',
                                                borderRadius: '2rem',
                                                padding: '0.375rem 0.875rem 0.375rem 0.5rem',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: '#0F172A',
                                                transition: 'background 200ms',
                                            }}
                                            className="hover:bg-white/80"
                                        >
                                            <UserInfo user={user} />
                                            <ChevronDown size={14} style={{ color: '#64748B', marginLeft: '0.125rem' }} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel className="p-0 font-normal">
                                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                                <UserInfo user={user} showEmail />
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem asChild>
                                                <Link href={dashboard().url} className="block w-full cursor-pointer">
                                                    <LayoutDashboard className="mr-2 size-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            {user.role === 'student' && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={editStudentProfile().url} className="block w-full cursor-pointer">
                                                        <UserCircle className="mr-2 size-4" />
                                                        Edit Profile
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem asChild>
                                                <Link href="/settings/profile" className="block w-full cursor-pointer">
                                                    <Settings className="mr-2 size-4" />
                                                    Settings
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={logout()}
                                                as="button"
                                                className="block w-full cursor-pointer"
                                            >
                                                <LogOut className="mr-2 size-4" />
                                                Log out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Link
                                        href="/login"
                                        style={NAV_LINK_BASE}
                                        className="hover:!text-blue-700"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register().url}
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
                                        Get started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Spacer for fixed navbar */}
                <div style={{ height: '5.5rem' }} />

                {/* Content */}
                <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem 3rem' }}>
                    {children}
                </main>

                <FlashMessages />
            </div>
        </>
    );
}
