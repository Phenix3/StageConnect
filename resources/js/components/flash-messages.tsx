import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export function FlashMessages() {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const flash = (props as any).flash as { success?: string; error?: string } | undefined;
    const toastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!flash?.success && !flash?.error) return;
        const el = toastRef.current;
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        const timer = setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(1rem)';
        }, 3500);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!flash?.success && !flash?.error) return null;

    const isError = !!flash?.error;
    const message = flash?.success ?? flash?.error;

    return (
        <div
            ref={toastRef}
            style={{
                opacity: 0,
                transform: 'translateY(1rem)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
            className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
                isError
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-green-600 text-white'
            }`}
        >
            {message}
        </div>
    );
}
