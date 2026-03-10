import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList, MessageSquare, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Student { user: { name: string }; city?: string; level?: string; }
interface Offer { id: number; title: string; }
interface Application {
    id: number;
    status: string;
    matching_score?: number;
    applied_at: string;
    cover_letter?: string;
    unread_count?: number;
    offer: Offer;
    student: Student;
}
interface Paginator<T> { data: T[]; current_page: number; last_page: number; next_page_url?: string; prev_page_url?: string; }
interface Props { applications: Paginator<Application>; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Applications Received', href: '/company/applications' }];

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
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`} title="Match score">
            {pct}%
        </span>
    );
}

function CandidateAvatar({ name }: { name: string }) {
    const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
    return (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
            {initials}
        </div>
    );
}

export default function CompanyApplications({ applications }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications Received" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Applications Received</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {applications.data.length === 0
                                ? 'No applications yet'
                                : `${applications.data.length} application${applications.data.length > 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <Button asChild size="sm" variant="outline">
                        <Link href="/company/offers">
                            <Users className="size-4 mr-1.5" /> My Offers
                        </Link>
                    </Button>
                </div>

                {applications.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-muted/20 py-20 text-center text-muted-foreground">
                        <ClipboardList className="size-10 opacity-30" />
                        <p className="font-medium">No applications received yet</p>
                        <p className="text-sm">Post an internship offer to start receiving applications from students.</p>
                        <Button asChild className="mt-2">
                            <Link href="/offers/create">Post an Offer</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {applications.data.map((app) => {
                            const status = statusConfig[app.status] ?? { label: app.status, classes: 'bg-gray-100 text-gray-600' };
                            return (
                                <div
                                    key={app.id}
                                    className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
                                >
                                    {/* Top row */}
                                    <div className="flex items-start gap-3">
                                        <CandidateAvatar name={app.student.user.name} />

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={`/applications/${app.id}`}
                                                className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {app.student.user.name}
                                            </Link>
                                            <p className="text-sm text-muted-foreground mt-0.5">
                                                For:{' '}
                                                <Link href={`/applications/${app.id}`} className="hover:underline cursor-pointer">
                                                    {app.offer.title}
                                                </Link>
                                            </p>
                                            <div className="mt-1.5 flex flex-wrap gap-2">
                                                {app.student.level && (
                                                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                                                        {app.student.level.toUpperCase()}
                                                    </span>
                                                )}
                                                {app.student.city && (
                                                    <span className="text-xs text-muted-foreground">{app.student.city}</span>
                                                )}
                                                <span className="text-xs text-muted-foreground">
                                                    Applied {new Date(app.applied_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex shrink-0 flex-col items-end gap-1.5">
                                            <div className="flex items-center gap-1.5">
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
                                        </div>
                                    </div>

                                    {/* Cover letter preview */}
                                    {app.cover_letter && (
                                        <p className="ml-13 line-clamp-2 text-sm text-muted-foreground border-l-2 border-muted pl-3">
                                            {app.cover_letter}
                                        </p>
                                    )}

                                    {/* Action buttons */}
                                    {(app.status === 'pending' || app.status === 'viewed') && (
                                        <div className="flex items-center gap-2 ml-13 pt-1">
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                                onClick={() => router.patch(`/applications/${app.id}/accept`)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="cursor-pointer"
                                                onClick={() => router.patch(`/applications/${app.id}/reject`)}
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="cursor-pointer"
                                                asChild
                                            >
                                                <Link href={`/applications/${app.id}`}>View Details</Link>
                                            </Button>
                                        </div>
                                    )}
                                    {app.status !== 'pending' && app.status !== 'viewed' && (
                                        <div className="ml-13">
                                            <Button size="sm" variant="outline" className="cursor-pointer" asChild>
                                                <Link href={`/applications/${app.id}`}>View Details</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
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
