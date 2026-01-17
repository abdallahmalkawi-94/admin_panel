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
import { type NavGroup } from '@/types';
import {
    Building2Icon,
    CreditCard,
    DollarSign,
    EarthIcon,
    Landmark,
    Languages,
    LayoutGrid,
    MessagesSquare,
    ReceiptIcon,
    Store,
    UsersIcon,
} from 'lucide-react';
import AppLogo from './app-logo';

const navigationGroups: NavGroup[] = [
    {
        title: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: '/',
                icon: LayoutGrid,
            },
            {
                title: 'User Management',
                href: '/users',
                icon: UsersIcon,
            },
            {
                title: 'Product Management',
                href: '/products',
                icon: Building2Icon,
            },
            {
                title: 'Merchant Management',
                href: '/merchants',
                icon: Store,
            },
            {
                title: 'Psp Management',
                href: '/psps',
                icon: Building2Icon,
            },
        ],
    },
    {
        title: 'Lookup',
        items: [
            {
                title: 'Countries',
                href: '/countries',
                icon: EarthIcon,
            },
            {
                title: 'Currencies',
                href: '/currencies',
                icon: DollarSign,
            },
            {
                title: 'Languages',
                href: '/languages',
                icon: Languages,
            },
            {
                title: 'Banks',
                href: '/banks',
                icon: Landmark,
            },
            {
                title: 'Payment Methods',
                href: '/payment-methods',
                icon: CreditCard,
            },
            {
                title: 'Payment Networks',
                href: '/payment-networks',
                icon: CreditCard,
            },
            {
                title: 'Message Types',
                href: '/message-types',
                icon: MessagesSquare,
            },
            {
                title: 'Invoice Types',
                href: '/invoice-types',
                icon: ReceiptIcon,
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
                            <AppLogo />
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
