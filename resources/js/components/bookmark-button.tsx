import { router } from '@inertiajs/react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';

interface BookmarkButtonProps {
    offerId: number;
    initialSaved: boolean;
    size?: 'sm' | 'md';
}

export default function BookmarkButton({ offerId, initialSaved, size = 'md' }: BookmarkButtonProps) {
    const [saved, setSaved] = useState(initialSaved);
    const [loading, setLoading] = useState(false);

    function toggle(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;
        setLoading(true);

        router.post(
            `/offers/${offerId}/bookmark`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setSaved((prev) => !prev),
                onFinish: () => setLoading(false),
            },
        );
    }

    const iconSize = size === 'sm' ? 14 : 16;

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={saved ? 'Remove bookmark' : 'Save offer'}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size === 'sm' ? '1.75rem' : '2rem',
                height: size === 'sm' ? '1.75rem' : '2rem',
                borderRadius: '0.5rem',
                background: saved ? 'rgba(219,234,254,0.8)' : 'rgba(241,245,249,0.7)',
                border: saved ? '1px solid rgba(147,197,253,0.6)' : '1px solid rgba(203,213,225,0.5)',
                color: saved ? '#1E40AF' : '#94A3B8',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 150ms ease',
                flexShrink: 0,
            }}
        >
            {saved ? <BookmarkCheck size={iconSize} /> : <Bookmark size={iconSize} />}
        </button>
    );
}
