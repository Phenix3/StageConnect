import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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
interface Props { stats: Stats; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin/dashboard' }];

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
    return (
        <div className="rounded-xl border p-6">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <h1 className="text-2xl font-semibold">Platform Overview</h1>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="Total Users" value={stats.users} />
                    <StatCard label="Students" value={stats.students} />
                    <StatCard label="Companies" value={stats.companies} sub={`${stats.verified_companies} verified · ${stats.pending_companies} pending`} />
                    <StatCard label="Active Offers" value={stats.active_offers} sub={`${stats.offers} total`} />
                    <StatCard label="Applications" value={stats.applications} />
                </div>
            </div>
        </AppLayout>
    );
}
