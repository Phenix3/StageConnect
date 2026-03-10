import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    FileText,
    LayoutGrid,
    Plus,
    Search,
    Shield,
    Star,
    User,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];

const roleLabels: Record<string, { label: string; color: string }> = {
    student: { label: 'Student', color: 'bg-blue-100 text-blue-700' },
    company: { label: 'Company', color: 'bg-violet-100 text-violet-700' },
    admin: { label: 'Admin', color: 'bg-amber-100 text-amber-700' },
};

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
}

interface ActionCard {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    title: string;
    desc: string;
    cta: string;
    href: string;
    accent?: boolean;
}

function DashboardCard({ card }: { card: ActionCard }) {
    const Icon = card.icon;
    return (
        <div className={`group flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${card.accent ? 'border-blue-200 ring-1 ring-blue-100' : 'border-border'}`}>
            <div
                className={`mb-4 flex size-11 items-center justify-center rounded-xl ${card.iconBg}`}
            >
                <Icon className={`size-5 ${card.iconColor}`} />
            </div>
            <h2 className="mb-1.5 font-semibold text-foreground">{card.title}</h2>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
            <Link
                href={card.href}
                className={`inline-flex w-fit items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    card.accent
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
            >
                {card.cta}
                <ArrowRight className="size-3.5" />
            </Link>
        </div>
    );
}

const studentCards: ActionCard[] = [
    {
        icon: User,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'My Profile',
        desc: 'Keep your skills, availability and CV up to date so companies find you.',
        cta: 'Edit Profile',
        href: '/student/profile/edit',
    },
    {
        icon: Search,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        title: 'Browse Offers',
        desc: 'Explore internship and apprenticeship offers from verified companies.',
        cta: 'Browse Offers',
        href: '/offers',
        accent: true,
    },
    {
        icon: Star,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: 'Recommended',
        desc: 'See offers scored by our algorithm specifically against your profile.',
        cta: 'See Matches',
        href: '/offers/recommended',
    },
    {
        icon: FileText,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        title: 'My Applications',
        desc: 'Track every application, reply to messages and follow up on your status.',
        cta: 'View Applications',
        href: '/student/applications',
    },
];

const companyCards: ActionCard[] = [
    {
        icon: Building2,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'Company Profile',
        desc: 'A complete profile attracts better candidates and increases your offer visibility.',
        cta: 'Edit Profile',
        href: '/company/profile/edit',
    },
    {
        icon: Plus,
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        title: 'Post an Offer',
        desc: 'Create a new internship or apprenticeship offer and start receiving applications.',
        cta: 'Post an Offer',
        href: '/offers/create',
        accent: true,
    },
    {
        icon: Briefcase,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: 'My Offers',
        desc: 'Manage your published offers — edit, pause or close positions at any time.',
        cta: 'Manage Offers',
        href: '/company/offers',
    },
    {
        icon: Users,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        title: 'Applications',
        desc: 'Review candidates, accept or reject applications, and message them directly.',
        cta: 'View Applications',
        href: '/company/applications',
    },
];

const adminCards: ActionCard[] = [
    {
        icon: LayoutGrid,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'Platform Overview',
        desc: 'Monitor key metrics: users, offers, applications and revenue.',
        cta: 'View Stats',
        href: '/admin/dashboard',
        accent: true,
    },
    {
        icon: Users,
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        title: 'Users',
        desc: 'Browse all registered students and companies, manage accounts.',
        cta: 'Manage Users',
        href: '/admin/users',
    },
    {
        icon: Shield,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        title: 'Verify Companies',
        desc: 'Review pending company profiles and grant verification status.',
        cta: 'Review Companies',
        href: '/admin/companies',
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;
    const role = roleLabels[user.role];

    const cards =
        user.role === 'student' ? studentCards : user.role === 'company' ? companyCards : adminCards;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Welcome header */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${role?.color ?? ''}`}
                            >
                                {role?.label}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {greeting()}, {user.name.split(' ')[0]}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {user.role === 'student' && "Ready to find the perfect internship? Here's your overview."}
                            {user.role === 'company' && 'Manage your offers and connect with talented students.'}
                            {user.role === 'admin' && "Here's a quick overview of the StageConnect platform."}
                        </p>
                    </div>
                </div>

                {/* Action cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <DashboardCard key={card.title} card={card} />
                    ))}
                </div>

                {/* Role-specific tip / info strip */}
                {user.role === 'student' && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-blue-800">
                        <strong>Tip:</strong> Complete your profile to unlock the recommendation engine — it scores every offer against your skills, location and availability.
                    </div>
                )}
                {user.role === 'company' && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                        <strong>Tip:</strong> Companies with a complete profile and verified badge receive up to 3× more applications. Upload your logo and fill in your description.
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
