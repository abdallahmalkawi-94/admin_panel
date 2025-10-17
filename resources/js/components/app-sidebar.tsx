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
import { dashboard } from '@/routes';
import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Building2Icon,
    DollarSign,
    Globe,
    Languages,
    LayoutGrid,
    UsersIcon,
} from 'lucide-react';
import AppLogo from './app-logo';

const navigationGroups: NavGroup[] = [
    {
        title: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: "/",
                icon: LayoutGrid,
            },
            {
                title: 'User Management',
                href: "/users",
                icon: UsersIcon,
            },
            {
                title: 'Product Management',
                href: "/products",
                icon: Building2Icon,
            },
        ],
    },
    {
        title: 'Lookup',
        items: [
            {
                title: 'Countries',
                href: "/countries",
                icon: Globe,
            },
            {
                title: 'Currencies',
                href: "/currencies",
                icon: DollarSign,
            },
            {
                title: 'Languages',
                href: "/languages",
                icon: Languages,
            },
        ],
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navigationGroups} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
