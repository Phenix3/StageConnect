import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface CheckoutData {
    plan?: string;
    transaction_id?: string;
    amount?: number;
}
interface Props {
    checkout?: CheckoutData;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Subscription Confirmed', href: '#' }];

export default function SubscriptionSuccess({ checkout }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription Confirmed" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-2xl font-semibold mb-2">Subscription Confirmed!</h1>
                    {checkout?.plan && (
                        <p className="text-muted-foreground mb-1">
                            Your <strong className="capitalize">{checkout.plan}</strong> plan is being activated.
                        </p>
                    )}
                    {checkout?.transaction_id && (
                        <p className="text-sm text-muted-foreground mb-4">
                            Transaction ID: <code>{checkout.transaction_id}</code>
                        </p>
                    )}
                    <p className="text-sm text-muted-foreground mb-6">
                        A confirmation email with your receipt will be sent shortly.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button asChild>
                            <Link href="/company/offers">Manage Offers</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
