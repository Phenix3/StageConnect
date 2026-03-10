import { usePage } from '@inertiajs/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function FlashMessages() {
    const { props } = usePage<{ flash?: { success?: string; error?: string } }>();
    const flash = (props as Record<string, unknown>).flash as { success?: string; error?: string } | undefined;
    const toastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!flash?.success && !flash?.error) return;
        const el = toastRef.current;
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateX(0)';
        const timer = setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(1.5rem)';
        }, 3500);
        return () => clearTimeout(timer);
    }, [flash]);

    if (!flash?.success && !flash?.error) return null;

    const isError = !!flash?.error;
    const message = flash?.success ?? flash?.error;

    return (
        <div
            ref={toastRef}
            role="alert"
            aria-live="polite"
            style={{
                opacity: 0,
                transform: 'translateX(1.5rem)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 max-w-sm rounded-xl px-4 py-3.5 text-sm font-medium shadow-xl border ${
                isError
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
        >
            {isError ? (
                <XCircle className="size-4 shrink-0 text-red-600" />
            ) : (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
            )}
            <span>{message}</span>
        </div>
    );
}
