import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface Company {
    id: number;
    name: string;
    sector?: string;
    plan: string;
    verified: boolean;
    created_at: string;
    user: { name: string; email: string };
}
interface Paginator<T> { data: T[]; current_page: number; last_page: number; }
interface Props { companies: Paginator<Company>; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Companies', href: '/admin/companies' },
];

export default function AdminCompanies({ companies }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies — Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Companies</h1>
                <div className="rounded-xl border overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3">Company</th>
                                <th className="text-left p-3">Owner</th>
                                <th className="text-left p-3">Sector</th>
                                <th className="text-left p-3">Plan</th>
                                <th className="text-left p-3">Verified</th>
                                <th className="text-left p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.data.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="p-3 font-medium">{c.name}</td>
                                    <td className="p-3 text-muted-foreground">{c.user.email}</td>
                                    <td className="p-3 text-muted-foreground">{c.sector ?? '—'}</td>
                                    <td className="p-3">
                                        <span className="text-xs border px-2 py-0.5 rounded-full capitalize">{c.plan}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {c.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <Button size="sm" variant="outline"
                                            onClick={() => router.patch(`/admin/companies/${c.id}/verify`)}>
                                            {c.verified ? 'Unverify' : 'Verify'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-muted-foreground">Page {companies.current_page} / {companies.last_page}</p>
            </div>
        </AppLayout>
    );
}
