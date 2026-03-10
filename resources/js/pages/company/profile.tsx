import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface CompanyProfile {
    id: number;
    name: string;
    sector?: string;
    size?: string;
    description?: string;
    website?: string;
    logo?: string;
    verified: boolean;
    user?: { name: string; email: string };
}

interface Props {
    company: CompanyProfile;
}

export default function CompanyProfileView({ company }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: company.name, href: `/companies/${company.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={company.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-2xl">
                    <div className="flex items-start gap-4 mb-6">
                        {company.logo && (
                            <img
                                src={`/storage/${company.logo}`}
                                alt={company.name}
                                className="h-20 w-20 rounded-lg object-cover"
                            />
                        )}
                        <div>
                            <h1 className="text-2xl font-semibold flex items-center gap-2">
                                {company.name}
                                {company.verified && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                                )}
                            </h1>
                            {company.sector && <p className="text-muted-foreground">{company.sector}</p>}
                            {company.size && <p className="text-sm text-muted-foreground">{company.size} employees</p>}
                        </div>
                    </div>

                    {company.description && (
                        <div className="mb-4">
                            <h2 className="font-semibold mb-2">About</h2>
                            <p className="text-muted-foreground whitespace-pre-line">{company.description}</p>
                        </div>
                    )}

                    {company.website && (
                        <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {company.website}
                        </a>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
