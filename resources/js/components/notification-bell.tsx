import { Bell, BellOff, CheckCheck, FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useNotifications, type AppNotification } from '@/hooks/use-notifications';

function NotificationIcon({ type }: { type: string }) {
    if (type === 'new_message') return <MessageSquare size={14} style={{ color: '#3B82F6', flexShrink: 0 }} />;
    if (type === 'new_application') return <FileText size={14} style={{ color: '#8B5CF6', flexShrink: 0 }} />;
    return <Bell size={14} style={{ color: '#F59E0B', flexShrink: 0 }} />;
}

function notificationText(n: AppNotification): string {
    const d = n.data;
    if (n.type === 'new_application') {
        return `${d.student_name as string} applied to "${d.offer_title as string}"`;
    }
    if (n.type === 'status_changed') {
        return `Your application for "${d.offer_title as string}" was ${d.new_status as string}`;
    }
    if (n.type === 'new_message') {
        return `New message from ${d.sender_name as string}`;
    }
    return 'New notification';
}

function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function notificationLink(n: AppNotification): string {
    const appId = n.data.application_id as number | undefined;
    if (appId) return `/applications/${appId}`;
    return '/dashboard';
}

export default function NotificationBell() {
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
    const [open, setOpen] = useState(false);

    function handleItemClick(n: AppNotification) {
        if (!n.read_at) void markRead(n.id);
        setOpen(false);
        window.location.href = notificationLink(n);
    }

    return (
        <div style={{ position: 'relative' }}>
            {/* Bell button */}
            <button
                onClick={() => setOpen((v) => !v)}
                style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    transition: 'color 150ms',
                }}
                className="hover:text-slate-900"
                title="Notifications"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '0.125rem',
                            right: '0.125rem',
                            width: '1rem',
                            height: '1rem',
                            background: '#EF4444',
                            color: 'white',
                            borderRadius: '999px',
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            lineHeight: 1,
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                        onClick={() => setOpen(false)}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 0.5rem)',
                            width: '22rem',
                            maxHeight: '28rem',
                            background: 'rgba(255,255,255,0.97)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(226,232,240,0.8)',
                            borderRadius: '1rem',
                            boxShadow: '0 8px 40px rgba(30,64,175,0.12)',
                            zIndex: 50,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.875rem 1rem',
                                borderBottom: '1px solid rgba(226,232,240,0.6)',
                                flexShrink: 0,
                            }}
                        >
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '0.9375rem', color: '#0F172A' }}>
                                Notifications
                                {unreadCount > 0 && (
                                    <span
                                        style={{
                                            marginLeft: '0.5rem',
                                            background: '#EF4444',
                                            color: 'white',
                                            borderRadius: '999px',
                                            padding: '0.0625rem 0.375rem',
                                            fontSize: '0.6875rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </span>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => void markAllRead()}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: 'none',
                                        border: 'none',
                                        color: '#3B82F6',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.375rem',
                                    }}
                                    className="hover:bg-blue-50"
                                >
                                    <CheckCheck size={13} /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div style={{ overflowY: 'auto', flex: 1 }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94A3B8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <BellOff size={28} style={{ opacity: 0.4 }} />
                                    <span style={{ fontSize: '0.875rem' }}>No notifications yet</span>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleItemClick(n)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.625rem',
                                            padding: '0.75rem 1rem',
                                            background: n.read_at ? 'transparent' : 'rgba(219,234,254,0.25)',
                                            border: 'none',
                                            borderBottom: '1px solid rgba(226,232,240,0.4)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'background 150ms',
                                        }}
                                        className="hover:bg-slate-50/70"
                                    >
                                        <div style={{ marginTop: '0.125rem', flexShrink: 0 }}>
                                            <NotificationIcon type={n.type} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '0.8125rem', color: '#1E293B', lineHeight: 1.4, marginBottom: '0.25rem', fontWeight: n.read_at ? 400 : 500 }}>
                                                {notificationText(n)}
                                            </p>
                                            <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                                                {relativeTime(n.created_at)}
                                            </span>
                                        </div>
                                        {!n.read_at && (
                                            <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '999px', background: '#3B82F6', flexShrink: 0, marginTop: '0.3125rem' }} />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
