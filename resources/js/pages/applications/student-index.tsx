import { Head, Link, router } from '@inertiajs/react';
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

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    viewed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-400',
};

export default function StudentApplications({ applications }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Applications" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">My Applications</h1>

                {applications.data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>You haven't applied to any offers yet.</p>
                        <Button asChild className="mt-4"><Link href="/offers">Browse Offers</Link></Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {applications.data.map((app) => (
                            <div key={app.id} className="rounded-xl border p-4 flex items-start justify-between">
                                <div>
                                    <Link href={`/applications/${app.id}`} className="font-semibold hover:underline">{app.offer.title}</Link>
                                    <p className="text-sm text-muted-foreground">{app.offer.company.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Applied {new Date(app.applied_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {app.matching_score && (
                                        <span className="text-sm font-medium text-primary">{Number(app.matching_score).toFixed(0)}% match</span>
                                    )}
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[app.status] ?? ''}`}>{app.status}</span>
                                    {(app.unread_count ?? 0) > 0 && (
                                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                            {app.unread_count} new
                                        </span>
                                    )}
                                    {app.status === 'pending' || app.status === 'viewed' ? (
                                        <Button variant="outline" size="sm"
                                            onClick={() => { if (confirm('Withdraw this application?')) router.patch(`/applications/${app.id}/withdraw`); }}>
                                            Withdraw
                                        </Button>
                                    ) : null}
                                </div>
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
