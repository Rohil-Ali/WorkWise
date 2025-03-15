import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, CheckCircleIcon, Timer } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'My Tasks',
        url: '/dashboard',
        icon: CheckCircleIcon,
    },
    {
        title: 'Calendar',
        url: '/calendar',
        icon: Calendar,
    },
    {
        title: 'Timer',
        url: '/timer',
        icon: Timer,
    },
    {
        title: 'About Us',
        url: '/aboutUs',
        icon: Calendar,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="rounded-tl-xl rounded-tr-xl bg-[#9475C9] text-white">
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

            {/* Main navigation */}
            <SidebarContent className="bg-[#9475C9] font-bold text-white">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="rounded-br-xl rounded-bl-xl bg-[#9475C9] text-white">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
