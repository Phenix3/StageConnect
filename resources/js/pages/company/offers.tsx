import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';

interface Skill { id: number; name: string; }
interface Offer { id: number; title: string; type: string; status: string; city?: string; remote: boolean; created_at: string; skills: Skill[]; }
interface Paginator<T> { data: T[]; current_page: number; last_page: number; next_page_url?: string; prev_page_url?: string; }
interface Props { offers: Paginator<Offer>; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'My Offers', href: '/company/offers' }];

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-gray-100 text-gray-700',
    filled: 'bg-blue-100 text-blue-700',
};

export default function CompanyOffers({ offers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Offers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">My Offers</h1>
                    <Button asChild><Link href="/offers/create">Post New Offer</Link></Button>
                </div>

                <div className="rounded-xl border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3">Title</th>
                                <th className="text-left p-3">Type</th>
                                <th className="text-left p-3">Status</th>
                                <th className="text-left p-3">Location</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offers.data.map((offer) => (
                                <tr key={offer.id} className="border-t">
                                    <td className="p-3">
                                        <Link href={`/offers/${offer.id}`} className="font-medium hover:underline">{offer.title}</Link>
                                    </td>
                                    <td className="p-3 text-muted-foreground capitalize">{offer.type}</td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[offer.status] ?? ''}`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-muted-foreground">
                                        {offer.city ?? '-'}{offer.remote && ' (remote)'}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={`/offers/${offer.id}/edit`}>Edit</Link>
                                        </Button>
                                        {offer.status === 'active' && (
                                            <Button variant="outline" size="sm" onClick={() => router.patch(`/offers/${offer.id}/pause`)}>Pause</Button>
                                        )}
                                        {offer.status === 'paused' && (
                                            <Button variant="outline" size="sm" onClick={() => router.patch(`/offers/${offer.id}/reopen`)}>Reopen</Button>
                                        )}
                                        <Button variant="destructive" size="sm" onClick={() => {
                                            if (confirm('Delete this offer?')) router.delete(`/offers/${offer.id}`);
                                        }}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex gap-2">
                    {offers.prev_page_url && (
                        <Button variant="outline" size="sm" onClick={() => router.get(offers.prev_page_url!)}>Previous</Button>
                    )}
                    <span className="text-sm text-muted-foreground self-center">Page {offers.current_page} / {offers.last_page}</span>
                    {offers.next_page_url && (
                        <Button variant="outline" size="sm" onClick={() => router.get(offers.next_page_url!)}>Next</Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
