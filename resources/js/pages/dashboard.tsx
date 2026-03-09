import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { Auth, BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const user = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Welcome back, {user.name}</h1>
                    <p className="text-muted-foreground mt-1">
                        {user.role === 'student' && 'Find the perfect internship to launch your career.'}
                        {user.role === 'company' && 'Connect with talented students for your internship positions.'}
                        {user.role === 'admin' && 'Manage the StageConnect platform.'}
                    </p>
                </div>

                {user.role === 'student' && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Your Profile</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Complete your profile so companies can find you.
                            </p>
                            <Link
                                href="/student/profile/edit"
                                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Edit Profile
                            </Link>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Browse Offers</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Explore internship offers from companies.
                            </p>
                            <Link
                                href="/offers"
                                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Browse Offers
                            </Link>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">My Applications</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Track the status of your applications.
                            </p>
                            <Link
                                href="/student/applications"
                                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                View Applications
                            </Link>
                        </div>
                    </div>
                )}

                {user.role === 'company' && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Company Profile</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Set up your company profile to attract students.
                            </p>
                            <Link
                                href="/company/profile/edit"
                                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Edit Profile
                            </Link>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Post an Offer</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Create internship offers to find the right candidates.
                            </p>
                            <Link
                                href="/offers/create"
                                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                Post an Offer
                            </Link>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Applications</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Review applications from students.
                            </p>
                            <Link
                                href="/company/applications"
                                className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                View Applications
                            </Link>
                        </div>
                    </div>
                )}

                {user.role === 'admin' && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Platform Overview</h2>
                            <p className="text-sm text-muted-foreground">
                                Monitor platform activity and manage users.
                            </p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Verify Companies</h2>
                            <p className="text-sm text-muted-foreground">
                                Review and verify company profiles.
                            </p>
                        </div>
                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <h2 className="font-semibold mb-2">Reports</h2>
                            <p className="text-sm text-muted-foreground">
                                View platform statistics and reports.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
