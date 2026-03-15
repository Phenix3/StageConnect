import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface AppNotification {
    id: string;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string;
}

interface SharedProps {
    notifications?: { unreadCount: number };
    auth?: { user?: { id: number } | null };
}

export function useNotifications() {
    const { notifications: shared, auth } = usePage().props as SharedProps;
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(shared?.unreadCount ?? 0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchNotifications = useCallback(async () => {
        if (!auth?.user) return;
        try {
            const res = await fetch('/notifications', {
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!res.ok) return;
            const data = (await res.json()) as { notifications: AppNotification[]; unread_count: number };
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch {
            // silently ignore network errors
        }
    }, [auth?.user]);

    useEffect(() => {
        if (!auth?.user) return;
        void fetchNotifications();
        intervalRef.current = setInterval(() => void fetchNotifications(), 30_000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [auth?.user, fetchNotifications]);

    const markRead = useCallback(
        async (id: string) => {
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
            setUnreadCount((c) => Math.max(0, c - 1));
            try {
                await fetch(`/notifications/${id}/read`, {
                    method: 'PATCH',
                    headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': getCsrfToken() },
                });
            } catch {
                // silently ignore
            }
        },
        [],
    );

    const markAllRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
        setUnreadCount(0);
        try {
            await fetch('/notifications/read-all', {
                method: 'PATCH',
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': getCsrfToken() },
            });
        } catch {
            // silently ignore
        }
    }, []);

    return { notifications, unreadCount, markRead, markAllRead, refresh: fetchNotifications };
}

function getCsrfToken(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';
}
