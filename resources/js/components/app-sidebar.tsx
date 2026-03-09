import { Link, usePage } from '@inertiajs/react';
import {
    Briefcase,
    Building2,
    CreditCard,
    FileText,
    LayoutGrid,
    Search,
    Star,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

function useNavItems(): NavItem[] {
    const { auth } = usePage<{ auth: { user?: { role?: string } } }>().props;
    const role = auth?.user?.role;

    if (role === 'student') {
        return [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Browse Offers', href: '/offers', icon: Search },
            { title: 'Recommended', href: '/offers/recommended', icon: Star },
            { title: 'My Applications', href: '/student/applications', icon: FileText },
            { title: 'My Profile', href: '/student/profile/edit', icon: Users },
        ];
    }

    if (role === 'company') {
        return [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'My Offers', href: '/company/offers', icon: Briefcase },
            { title: 'Post an Offer', href: '/offers/create', icon: FileText },
            { title: 'Applications', href: '/company/applications', icon: Users },
            { title: 'My Profile', href: '/company/profile/edit', icon: Building2 },
            { title: 'Subscription', href: '/subscription/plans', icon: CreditCard },
        ];
    }

    if (role === 'admin') {
        return [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'All Offers', href: '/offers', icon: Briefcase },
        ];
    }

    // Unauthenticated / fallback
    return [
        { title: 'Browse Offers', href: '/offers', icon: Search },
    ];
}

export function AppSidebar() {
    const navItems = useNavItems();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
