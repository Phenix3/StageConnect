import { Head, Link, router } from '@inertiajs/react';
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
    offer: Offer;
    student: Student;
}
interface Paginator<T> { data: T[]; current_page: number; last_page: number; next_page_url?: string; prev_page_url?: string; }
interface Props { applications: Paginator<Application>; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Applications Received', href: '/company/applications' }];

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    viewed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-400',
};

export default function CompanyApplications({ applications }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications Received" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Applications Received</h1>

                {applications.data.length === 0 ? (
                    <p className="text-muted-foreground py-12 text-center">No applications received yet.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {applications.data.map((app) => (
                            <div key={app.id} className="rounded-xl border p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="font-semibold">{app.student.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            For: <Link href={`/offers/${app.offer.id}`} className="hover:underline">{app.offer.title}</Link>
                                        </p>
                                        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                                            {app.student.level && <span>{app.student.level.toUpperCase()}</span>}
                                            {app.student.city && <span>{app.student.city}</span>}
                                            <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {app.matching_score && (
                                            <span className="text-sm font-medium text-primary">{Number(app.matching_score).toFixed(0)}%</span>
                                        )}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[app.status] ?? ''}`}>{app.status}</span>
                                    </div>
                                </div>
                                {app.cover_letter && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{app.cover_letter}</p>
                                )}
                                {app.status === 'pending' || app.status === 'viewed' ? (
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => router.patch(`/applications/${app.id}/accept`)}>Accept</Button>
                                        <Button size="sm" variant="destructive" onClick={() => router.patch(`/applications/${app.id}/reject`)}>Reject</Button>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    {applications.prev_page_url && <Button variant="outline" size="sm" onClick={() => router.get(applications.prev_page_url!)}>Previous</Button>}
                    {applications.next_page_url && <Button variant="outline" size="sm" onClick={() => router.get(applications.next_page_url!)}>Next</Button>}
                </div>
            </div>
        </AppLayout>
    );
}
