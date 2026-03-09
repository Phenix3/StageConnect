import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Skill { id: number; name: string; slug: string; }
interface Company { id: number; name: string; logo?: string; }
interface Offer {
    id: number;
    title: string;
    city?: string;
    remote: boolean;
    type: string;
    level_required?: string;
    duration?: string;
    is_premium: boolean;
    expires_at?: string;
    company: Company;
    skills: Skill[];
    created_at: string;
}
interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url?: string;
    prev_page_url?: string;
}
interface Props {
    offers: Paginator<Offer>;
    skills: Skill[];
    filters: Record<string, string | boolean | string[]>;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Offers', href: '/offers' }];

export default function OffersIndex({ offers, skills, filters }: Props) {
    const [search, setSearch] = useState({
        type: (filters.type as string) ?? '',
        city: (filters.city as string) ?? '',
        remote: filters.remote ? '1' : '',
        level: (filters.level as string) ?? '',
    });

    function applyFilters() {
        router.get('/offers', { ...search, remote: search.remote ? true : undefined }, { preserveState: true });
    }

    function resetFilters() {
        router.get('/offers');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offers" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="grid gap-1">
                        <label className="text-xs font-medium">Type</label>
                        <select
                            value={search.type}
                            onChange={(e) => setSearch({ ...search, type: e.target.value })}
                            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                        >
                            <option value="">All types</option>
                            <option value="stage">Stage</option>
                            <option value="alternance">Alternance</option>
                            <option value="emploi">Emploi</option>
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs font-medium">City</label>
                        <Input
                            value={search.city}
                            onChange={(e) => setSearch({ ...search, city: e.target.value })}
                            placeholder="Any city"
                            className="h-9 w-32"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={search.remote === '1'}
                            onChange={(e) => setSearch({ ...search, remote: e.target.checked ? '1' : '' })}
                        />
                        Remote
                    </label>
                    <Button onClick={applyFilters} size="sm">Filter</Button>
                    <Button onClick={resetFilters} variant="outline" size="sm">Reset</Button>
                </div>

                {/* Offers grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {offers.data.map((offer) => (
                        <Link
                            key={offer.id}
                            href={`/offers/${offer.id}`}
                            className={`block rounded-xl border p-4 hover:shadow-md transition-shadow ${offer.is_premium ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs uppercase tracking-wide text-muted-foreground">{offer.type}</span>
                                {offer.is_premium && <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Premium</span>}
                            </div>
                            <h3 className="font-semibold mb-1 line-clamp-2">{offer.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{offer.company.name}</p>
                            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mb-3">
                                {offer.city && <span>{offer.city}</span>}
                                {offer.remote && <span>· Remote</span>}
                                {offer.level_required && <span>· {offer.level_required.toUpperCase()}</span>}
                                {offer.duration && <span>· {offer.duration}</span>}
                            </div>
                            {offer.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {offer.skills.slice(0, 4).map((s) => (
                                        <span key={s.id} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{s.name}</span>
                                    ))}
                                    {offer.skills.length > 4 && <span className="text-xs text-muted-foreground">+{offer.skills.length - 4}</span>}
                                </div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex gap-2 mt-2">
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
