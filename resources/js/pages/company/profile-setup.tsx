import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { type BreadcrumbItem } from '@/types';

interface CompanyProfile {
    name?: string;
    sector?: string;
    size?: string;
    description?: string;
    website?: string;
    logo?: string;
}

interface Props {
    profile?: CompanyProfile;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Company Profile Setup', href: '/company/profile/edit' },
];

const SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function CompanyProfileSetup({ profile }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name ?? '',
        sector: profile?.sector ?? '',
        size: profile?.size ?? '',
        description: profile?.description ?? '',
        website: profile?.website ?? '',
        logo: null as File | null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/company/profile', { forceFormData: true });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company Profile Setup" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-2xl">
                    <h1 className="text-2xl font-semibold mb-6">Set up your company profile</h1>
                    <form onSubmit={submit} className="flex flex-col gap-6" encType="multipart/form-data">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Company Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Your company name"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sector">Sector</Label>
                            <Input
                                id="sector"
                                value={data.sector}
                                onChange={(e) => setData('sector', e.target.value)}
                                placeholder="e.g. Technology, Finance, Healthcare..."
                            />
                            <InputError message={errors.sector} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="size">Company Size</Label>
                            <select
                                id="size"
                                value={data.size}
                                onChange={(e) => setData('size', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            >
                                <option value="">Select size...</option>
                                {SIZES.map((s) => (
                                    <option key={s} value={s}>{s} employees</option>
                                ))}
                            </select>
                            <InputError message={errors.size} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe your company..."
                                rows={5}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                type="url"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                                placeholder="https://yourcompany.com"
                            />
                            <InputError message={errors.website} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="logo">Logo (image — max 2MB)</Label>
                            {profile?.logo && (
                                <p className="text-sm text-muted-foreground">Current logo uploaded. Upload a new one to replace it.</p>
                            )}
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('logo', e.target.files?.[0] ?? null)}
                            />
                            <InputError message={errors.logo} />
                        </div>

                        <Button type="submit" disabled={processing} className="w-fit">
                            Save Profile
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
