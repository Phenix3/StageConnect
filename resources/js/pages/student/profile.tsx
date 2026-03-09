import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Skill { id: number; name: string; }
interface StudentProfile {
    id: number;
    bio?: string;
    level?: string;
    school?: string;
    city?: string;
    languages?: string[];
    availability_from?: string;
    availability_to?: string;
    skills: Skill[];
    user: { name: string };
}
interface Props { student: StudentProfile; }

export default function StudentProfileView({ student }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: student.user.name, href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={student.user.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-2xl">
                <div>
                    <h1 className="text-2xl font-semibold">{student.user.name}</h1>
                    {student.level && (
                        <p className="text-muted-foreground">{student.level.toUpperCase()}{student.school ? ` · ${student.school}` : ''}</p>
                    )}
                    {student.city && <p className="text-sm text-muted-foreground">{student.city}</p>}
                </div>

                {student.bio && (
                    <div>
                        <h2 className="font-semibold mb-1">About</h2>
                        <p className="text-muted-foreground whitespace-pre-line">{student.bio}</p>
                    </div>
                )}

                {student.skills.length > 0 && (
                    <div>
                        <h2 className="font-semibold mb-2">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {student.skills.map((s) => (
                                <span key={s.id} className="text-sm bg-secondary px-3 py-1 rounded-full">{s.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {student.languages && student.languages.length > 0 && (
                    <div>
                        <h2 className="font-semibold mb-2">Languages</h2>
                        <div className="flex flex-wrap gap-2">
                            {student.languages.map((l) => (
                                <span key={l} className="text-sm border px-3 py-1 rounded-full">{l}</span>
                            ))}
                        </div>
                    </div>
                )}

                {(student.availability_from || student.availability_to) && (
                    <div>
                        <h2 className="font-semibold mb-1">Availability</h2>
                        <p className="text-muted-foreground text-sm">
                            {student.availability_from && `From ${student.availability_from}`}
                            {student.availability_from && student.availability_to && ' to '}
                            {student.availability_to && student.availability_to}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
