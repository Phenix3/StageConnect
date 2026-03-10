import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle2,
    ClipboardList,
    Clock,
    GraduationCap,
    Users,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface Stats {
    users: number;
    students: number;
    companies: number;
    offers: number;
    active_offers: number;
    applications: number;
    verified_companies: number;
    pending_companies: number;
}
interface Props {
    stats: Stats;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin/dashboard' }];

interface StatCardProps {
    label: string;
    value: number;
    sub?: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
}

function StatCard({ label, value, sub, icon: Icon, iconBg, iconColor }: StatCardProps) {
    return (
        <div className="flex items-start gap-4 rounded-2xl border bg-card p-5 shadow-sm">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon className={`size-5 ${iconColor}`} />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
                    {value.toLocaleString()}
                </p>
                {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
            </div>
        </div>
    );
}

export default function AdminDashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Platform Overview</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Live statistics for the StageConnect platform
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total Users"
                        value={stats.users}
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                    />
                    <StatCard
                        label="Students"
                        value={stats.students}
                        icon={GraduationCap}
                        iconBg="bg-violet-100"
                        iconColor="text-violet-600"
                    />
                    <StatCard
                        label="Companies"
                        value={stats.companies}
                        sub={`${stats.verified_companies} verified · ${stats.pending_companies} pending`}
                        icon={Building2}
                        iconBg="bg-amber-100"
                        iconColor="text-amber-600"
                    />
                    <StatCard
                        label="Active Offers"
                        value={stats.active_offers}
                        sub={`${stats.offers} total`}
                        icon={Briefcase}
                        iconBg="bg-emerald-100"
                        iconColor="text-emerald-600"
                    />
                    <StatCard
                        label="Applications"
                        value={stats.applications}
                        icon={ClipboardList}
                        iconBg="bg-cyan-100"
                        iconColor="text-cyan-600"
                    />
                </div>

                {/* Quick actions */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <QuickAction
                        icon={Clock}
                        iconBg="bg-amber-100"
                        iconColor="text-amber-600"
                        title="Pending Verifications"
                        desc={`${stats.pending_companies} compan${stats.pending_companies === 1 ? 'y' : 'ies'} awaiting verification`}
                        href="/admin/companies"
                        cta="Review Companies"
                    />
                    <QuickAction
                        icon={CheckCircle2}
                        iconBg="bg-emerald-100"
                        iconColor="text-emerald-600"
                        title="Verified Companies"
                        desc={`${stats.verified_companies} compan${stats.verified_companies === 1 ? 'y' : 'ies'} verified on the platform`}
                        href="/admin/companies"
                        cta="View All"
                    />
                    <QuickAction
                        icon={Users}
                        iconBg="bg-blue-100"
                        iconColor="text-blue-600"
                        title="User Management"
                        desc={`${stats.students} students · ${stats.companies} companies`}
                        href="/admin/users"
                        cta="Manage Users"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function QuickAction({
    icon: Icon,
    iconBg,
    iconColor,
    title,
    desc,
    href,
    cta,
}: {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    title: string;
    desc: string;
    href: string;
    cta: string;
}) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon className={`size-4 ${iconColor}`} />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{desc}</p>
            <Link
                href={href}
                className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 cursor-pointer"
            >
                {cta} <ArrowRight className="size-3.5" />
            </Link>
        </div>
    );
}
