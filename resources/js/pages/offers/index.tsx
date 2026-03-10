import { Head, Link, router } from '@inertiajs/react';
import { Briefcase, MapPin, Monitor, Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';

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

const typeLabels: Record<string, { label: string; color: string }> = {
    stage: { label: 'Internship', color: 'bg-blue-100 text-blue-700' },
    alternance: { label: 'Apprenticeship', color: 'bg-violet-100 text-violet-700' },
    emploi: { label: 'Job', color: 'bg-emerald-100 text-emerald-700' },
};

function CompanyAvatar({ name, logo }: { name: string; logo?: string }) {
    if (logo) {
        return (
            <img
                src={logo}
                alt={name}
                className="size-9 rounded-lg object-cover border border-border"
            />
        );
    }
    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    return (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">
            {initials}
        </div>
    );
}

export default function OffersIndex({ offers, filters }: Props) {
    const [search, setSearch] = useState({
        type: (filters.type as string) ?? '',
        city: (filters.city as string) ?? '',
        remote: filters.remote ? '1' : '',
        level: (filters.level as string) ?? '',
    });

    const hasFilters = search.type || search.city || search.remote || search.level;

    function applyFilters() {
        router.get('/offers', { ...search, remote: search.remote ? true : undefined }, { preserveState: true });
    }

    function resetFilters() {
        setSearch({ type: '', city: '', remote: '', level: '' });
        router.get('/offers');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offers" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Browse Offers</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {offers.data.length > 0
                                ? `Showing ${offers.data.length} offer${offers.data.length > 1 ? 's' : ''} · Page ${offers.current_page}/${offers.last_page}`
                                : 'No offers found'}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-3 rounded-xl border bg-muted/30 p-4">
                    <SlidersHorizontal className="size-4 text-muted-foreground self-center" />

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">Type</label>
                        <select
                            value={search.type}
                            onChange={(e) => setSearch({ ...search, type: e.target.value })}
                            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                            <option value="">All types</option>
                            <option value="stage">Internship</option>
                            <option value="alternance">Apprenticeship</option>
                            <option value="emploi">Job</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">Level</label>
                        <select
                            value={search.level}
                            onChange={(e) => setSearch({ ...search, level: e.target.value })}
                            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                        >
                            <option value="">All levels</option>
                            <option value="bac">Bac</option>
                            <option value="bac+2">Bac+2</option>
                            <option value="bac+3">Bac+3</option>
                            <option value="bac+4">Bac+4</option>
                            <option value="bac+5">Bac+5</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-muted-foreground">City</label>
                        <Input
                            value={search.city}
                            onChange={(e) => setSearch({ ...search, city: e.target.value })}
                            placeholder="Any city"
                            className="h-9 w-36 text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                        />
                    </div>

                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium self-end pb-0.5">
                        <input
                            type="checkbox"
                            checked={search.remote === '1'}
                            onChange={(e) => setSearch({ ...search, remote: e.target.checked ? '1' : '' })}
                            className="size-4 cursor-pointer rounded accent-primary"
                        />
                        Remote only
                    </label>

                    <div className="flex gap-2 self-end">
                        <Button onClick={applyFilters} size="sm" className="cursor-pointer">
                            <Search className="size-3.5 mr-1.5" /> Search
                        </Button>
                        {hasFilters && (
                            <Button onClick={resetFilters} variant="outline" size="sm" className="cursor-pointer gap-1.5">
                                <X className="size-3.5" /> Clear
                            </Button>
                        )}
                    </div>
                </div>

                {/* Offers grid */}
                {offers.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                        <Briefcase className="size-10 opacity-30" />
                        <p className="font-medium">No offers found</p>
                        <p className="text-sm">Try adjusting your filters or check back later.</p>
                        {hasFilters && (
                            <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2 cursor-pointer">
                                Clear filters
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {offers.data.map((offer) => {
                            const typeInfo = typeLabels[offer.type] ?? { label: offer.type, color: 'bg-gray-100 text-gray-700' };
                            return (
                                <Link
                                    key={offer.id}
                                    href={`/offers/${offer.id}`}
                                    className={`group flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                                        offer.is_premium ? 'border-amber-300 ring-1 ring-amber-200' : 'border-border'
                                    }`}
                                >
                                    {/* Header row */}
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5">
                                            <CompanyAvatar name={offer.company.name} logo={offer.company.logo} />
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-medium text-muted-foreground">
                                                    {offer.company.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1.5">
                                            {offer.is_premium && (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                    Premium
                                                </span>
                                            )}
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${typeInfo.color}`}>
                                                {typeInfo.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="mb-2 font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                        {offer.title}
                                    </h3>

                                    {/* Meta */}
                                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        {(offer.city || offer.remote) && (
                                            <span className="flex items-center gap-1">
                                                {offer.remote ? (
                                                    <Monitor className="size-3" />
                                                ) : (
                                                    <MapPin className="size-3" />
                                                )}
                                                {offer.remote ? 'Remote' : offer.city}
                                            </span>
                                        )}
                                        {offer.level_required && (
                                            <span className="rounded-md bg-muted px-1.5 py-0.5">
                                                {offer.level_required.toUpperCase()}
                                            </span>
                                        )}
                                        {offer.duration && (
                                            <span className="text-muted-foreground">{offer.duration}</span>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    {offer.skills.length > 0 && (
                                        <div className="mt-auto flex flex-wrap gap-1 pt-2">
                                            {offer.skills.slice(0, 4).map((s) => (
                                                <span
                                                    key={s.id}
                                                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                                                >
                                                    {s.name}
                                                </span>
                                            ))}
                                            {offer.skills.length > 4 && (
                                                <span className="text-xs text-muted-foreground self-center">
                                                    +{offer.skills.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {offers.last_page > 1 && (
                    <div className="flex items-center gap-3">
                        {offers.prev_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(offers.prev_page_url!)} className="cursor-pointer">
                                ← Previous
                            </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Page {offers.current_page} / {offers.last_page}
                        </span>
                        {offers.next_page_url && (
                            <Button variant="outline" size="sm" onClick={() => router.get(offers.next_page_url!)} className="cursor-pointer">
                                Next →
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
