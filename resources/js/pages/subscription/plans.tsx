import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface PlanDetails {
    name: string;
    price: number;
    currency: string;
    max_offers: number;
    features: string[];
}
interface Props {
    plans: Record<string, PlanDetails>;
    current: string;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Subscription Plans', href: '/subscription/plans' }];

export default function SubscriptionPlans({ plans, current }: Props) {
    const { data, setData, post, processing } = useForm({
        plan: '',
        provider: 'cinetpay',
    });

    function subscribe(plan: string) {
        setData('plan', plan);
        post('/subscription/checkout');
    }

    const planOrder = ['free', 'starter', 'pro'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subscription Plans" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold">Subscription Plans</h1>
                    <p className="text-muted-foreground mt-1">Choose the plan that fits your hiring needs</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-3 max-w-4xl">
                    {planOrder.map((key) => {
                        const plan = plans[key];
                        const isCurrent = key === current;
                        const isPopular = key === 'starter';

                        return (
                            <div
                                key={key}
                                className={`relative rounded-xl border p-6 flex flex-col ${
                                    isPopular ? 'border-primary shadow-lg' : ''
                                } ${isCurrent ? 'bg-primary/5' : ''}`}
                            >
                                {isPopular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                )}
                                <h2 className="text-lg font-bold mb-1">{plan.name}</h2>
                                <div className="text-3xl font-bold mb-4">
                                    {plan.price === 0 ? 'Free' : `${plan.currency}${plan.price}`}
                                    {plan.price > 0 && <span className="text-base font-normal text-muted-foreground">/year</span>}
                                </div>

                                <ul className="flex flex-col gap-2 mb-6 flex-1">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isCurrent ? (
                                    <Button disabled variant="outline" className="w-full">Current Plan</Button>
                                ) : key === 'free' ? (
                                    <Button disabled variant="outline" className="w-full">Downgrade</Button>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div className="grid gap-1">
                                            <label className="text-xs text-muted-foreground">Payment method</label>
                                            <select
                                                value={data.provider}
                                                onChange={(e) => setData('provider', e.target.value)}
                                                className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                                            >
                                                <option value="cinetpay">CinetPay</option>
                                                <option value="stripe">Stripe</option>
                                            </select>
                                        </div>
                                        <Button
                                            onClick={() => subscribe(key)}
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            Upgrade to {plan.name}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
