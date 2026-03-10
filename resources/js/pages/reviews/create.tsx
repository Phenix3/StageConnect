import { Head, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type {BreadcrumbItem} from '@/types';

interface Offer { title: string; }
interface Student { user: { name: string }; }
interface Application { id: number; offer: Offer; student: Student; }
interface Props { application: Application; }

export default function CreateReview({ application }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Leave a Review', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        rating: 5,
        comment: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/applications/${application.id}/review`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave a Review" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-lg">
                <h1 className="text-2xl font-semibold">Leave a Review</h1>
                <p className="text-muted-foreground">
                    Review for: <strong>{application.offer.title}</strong> · {application.student.user.name}
                </p>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-2">
                        <Label>Rating</Label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    className={`text-2xl transition-opacity ${data.rating >= star ? 'opacity-100' : 'opacity-30'}`}
                                >
                                    &#9733;
                                </button>
                            ))}
                        </div>
                        <InputError message={errors.rating} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="comment">Comment (optional)</Label>
                        <Textarea
                            id="comment"
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            placeholder="Share your experience..."
                            rows={4}
                        />
                        <InputError message={errors.comment} />
                    </div>

                    <Button type="submit" disabled={processing} className="w-fit">Submit Review</Button>
                </form>
            </div>
        </AppLayout>
    );
}
