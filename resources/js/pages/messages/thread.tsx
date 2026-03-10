import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface Sender { id: number; name: string; }
interface Message { id: number; body: string; read_at?: string; created_at: string; sender: Sender; }
interface Company { id: number; name: string; }
interface Student { user: { name: string }; }
interface Offer { title: string; company: Company; }
interface Application { id: number; offer: Offer; student: Student; }
interface Props {
    application: Application;
    messages: Message[];
    auth: { user: { id: number } };
}

export default function MessageThread({ application, messages, auth }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Applications', href: '#' },
        { title: `Messages — ${application.offer.title}`, href: '#' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({ body: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/applications/${application.id}/messages`, {
            onSuccess: () => reset('body'),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Messages — ${application.offer.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl">
                <Link href={`/applications/${application.id}`} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                    ← Back to application
                </Link>
                <div>
                    <h1 className="text-xl font-semibold">{application.offer.title}</h1>
                    <p className="text-sm text-muted-foreground">{application.offer.company.name} · {application.student.user.name}</p>
                </div>

                {/* Messages */}
                <div className="flex flex-col gap-3 flex-1 min-h-0">
                    {messages.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No messages yet. Start the conversation.</p>
                    ) : (
                        messages.map((msg) => {
                            const isOwn = msg.sender.id === auth.user.id;
                            return (
                                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        {!isOwn && <p className="text-xs font-medium mb-1 opacity-70">{msg.sender.name}</p>}
                                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                                        <p className="text-xs opacity-50 mt-1 text-right">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Reply form */}
                <form onSubmit={submit} className="flex flex-col gap-2 border-t pt-4">
                    <Textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Type your message..."
                        rows={3}
                    />
                    <InputError message={errors.body} />
                    <Button type="submit" disabled={processing} className="w-fit">Send</Button>
                </form>
            </div>
        </AppLayout>
    );
}
