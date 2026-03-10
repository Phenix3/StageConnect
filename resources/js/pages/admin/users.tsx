import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}
interface Paginator<T> { data: T[]; current_page: number; last_page: number; }
interface Props { users: Paginator<UserRow>; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

const roleColors: Record<string, string> = {
    student: 'bg-blue-100 text-blue-700',
    company: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
};

export default function AdminUsers({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users — Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">
                    Users <span className="text-muted-foreground text-lg font-normal">({users.data.length} on page)</span>
                </h1>
                <div className="rounded-xl border overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3">Name</th>
                                <th className="text-left p-3">Email</th>
                                <th className="text-left p-3">Role</th>
                                <th className="text-left p-3">Verified</th>
                                <th className="text-left p-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3 font-medium">{u.name}</td>
                                    <td className="p-3 text-muted-foreground">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[u.role] ?? ''}`}>{u.role}</span>
                                    </td>
                                    <td className="p-3">{u.email_verified_at ? '✓' : '✗'}</td>
                                    <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-muted-foreground">Page {users.current_page} / {users.last_page}</p>
            </div>
        </AppLayout>
    );
}
