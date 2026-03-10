import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, FileText, MessageSquare } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Offer { id: number; title: string; company: { id: number; name: string }; }
interface Application {
    id: number;
    status: string;
    matching_score?: number;
    applied_at: string;
    unread_count?: number;
    offer: Offer;
}
interface Paginator<T> { data: T[]; current_page: number; last_page: number; next_page_url?: string; prev_page_url?: string; }
interface Props { applications: Paginator<Application>; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'My Applications', href: '/student/applications' }];

const statusConfig: Record<string, { label: string; classes: string }> = {
    pending:   { label: 'Pending',   classes: 'bg-gray-100 text-gray-600' },
    viewed:    { label: 'Viewed',    classes: 'bg-blue-100 text-blue-700' },
    accepted:  { label: 'Accepted',  classes: 'bg-emerald-100 text-emerald-700' },
    rejected:  { label: 'Rejected',  classes: 'bg-red-100 text-red-700' },
    withdrawn: { label: 'Withdrawn', classes: 'bg-gray-100 text-gray-400' },
};

function ScoreBadge({ score }: { score: number }) {
    const pct = Math.round(score);
    const color =
        pct >= 80 ? 'bg-emerald-100 text-emerald-700' :
        pct >= 60 ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600';
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            {pct}% match
        </span>
    );
}

export default function StudentApplications({ applications }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Applications" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Applications</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {applications.data.length === 0
                                ? 'No applications yet'
                                : `${applications.data.length} application${applications.data.length > 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <Button asChild size="sm">
                        <Link href="/offers">
                            <Briefcase className="size-4 mr-1.5" /> Browse Offers
                        </Link>
                    </Button>
                </div>

                {applications.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/20 py-20 text-center text-muted-foreground">
                        <FileText className="size-10 opacity-30" />
                        <p className="font-medium">You haven't applied to any offers yet</p>
                        <p className="text-sm">Browse offers and apply to positions that match your profile.</p>
                        <Button asChild className="mt-2">
                            <Link href="/offers">Browse Offers</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {applications.data.map((app) => {
                            const status = statusConfig[app.status] ?? { label: app.status, classes: 'bg-gray-100 text-gray-600' };
                            const companyInitials = app.offer.company.name
                                .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

                            return (
                                <Link
                                    key={app.id}
                                    href={`/applications/${app.id}`}
                                    className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                                >
                                    {/* Company avatar */}
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
                                        {companyInitials}
                                    </div>

                                    {/* Main info */}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                                            {app.offer.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{app.offer.company.name}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Applied {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            {app.matching_score != null && (
                                                <ScoreBadge score={Number(app.matching_score)} />
                                            )}
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.classes}`}>
                                                {status.label}
                                            </span>
                                            {(app.unread_count ?? 0) > 0 && (
                                                <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                                                    <MessageSquare className="size-3" />
                                                    {app.unread_count}
                                                </span>
                                            )}
                                        </div>
                                        {(app.status === 'pending' || app.status === 'viewed') && (
                                            <button
                                                type="button"
                                                className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Withdraw this application?')) {
                                                        router.patch(`/applications/${app.id}/withdraw`);
                                                    }
                                                }}
                                            >
                                                Withdraw
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {applications.last_page > 1 && (
                    <div className="flex items-center gap-3">
                        {applications.prev_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(applications.prev_page_url!)} className="cursor-pointer">
                                ← Previous
                            </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Page {applications.current_page} / {applications.last_page}
                        </span>
                        {applications.next_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(applications.next_page_url!)} className="cursor-pointer">
                                Next →
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
