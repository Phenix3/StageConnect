import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Company { id: number; name: string; }
interface Offer { id: number; title: string; company: Company; type: string; }
interface Student { id: number; user: { name: string }; }
interface Application {
    id: number;
    status: string;
    cover_letter?: string;
    matching_score?: number;
    applied_at: string;
    offer: Offer;
    student: Student;
}
interface Props {
    application: Application;
    auth: { user: { id: number; role: string } };
    canReview: boolean;
}

const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    viewed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-400',
};

export default function ApplicationShow({ application, auth, canReview }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Applications', href: auth.user.role === 'student' ? '/student/applications' : '/company/applications' },
        { title: application.offer.title, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Application — ${application.offer.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 max-w-2xl">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">{application.offer.title}</h1>
                        <Link href={`/companies/${application.offer.company.id}`} className="text-sm text-primary hover:underline">
                            {application.offer.company.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[application.status] ?? ''}`}>
                                {application.status}
                            </span>
                            {application.matching_score && (
                                <span className="text-sm font-medium text-primary">
                                    {Number(application.matching_score).toFixed(0)}% match
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {auth.user.role === 'company' && (application.status === 'pending' || application.status === 'viewed') && (
                            <>
                                <Button size="sm" onClick={() => router.patch(`/applications/${application.id}/accept`)}>Accept</Button>
                                <Button size="sm" variant="destructive" onClick={() => router.patch(`/applications/${application.id}/reject`)}>Reject</Button>
                            </>
                        )}
                        {auth.user.role === 'student' && (application.status === 'pending' || application.status === 'viewed') && (
                            <Button size="sm" variant="outline"
                                onClick={() => { if (confirm('Withdraw this application?')) router.patch(`/applications/${application.id}/withdraw`); }}>
                                Withdraw
                            </Button>
                        )}
                    </div>
                </div>

                {/* Student info (for company view) */}
                {auth.user.role === 'company' && (
                    <div className="rounded-xl border p-4">
                        <h2 className="font-semibold mb-1">Applicant</h2>
                        <p>{application.student.user.name}</p>
                    </div>
                )}

                {/* Cover letter */}
                {application.cover_letter && (
                    <div>
                        <h2 className="font-semibold mb-2">Cover Letter</h2>
                        <div className="rounded-xl border p-4 text-sm text-muted-foreground whitespace-pre-line">
                            {application.cover_letter}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                    <Button variant="outline" asChild>
                        <Link href={`/applications/${application.id}/messages`}>View Messages</Link>
                    </Button>
                    {canReview && (
                        <Button variant="outline" asChild>
                            <Link href={`/applications/${application.id}/review`}>Leave a Review</Link>
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
