import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type NavGroup, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();
    return (
        <>
            {groups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-0">
                    <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => {
                            // Check if this item has sub-items (collapsible)
                            if (item.items && item.items.length > 0) {
                                return (
                                    <CollapsibleNavItem
                                        key={item.title}
                                        item={item}
                                        page={page}
                                    />
                                );
                            }
                            
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.href && (page.url === item.href || page.url.startsWith(item.href as string, 1))}
                                        tooltip={{ children: item.title }}
                                    >
                                        {item.href ? (
                                            <Link href={item.href} prefetch>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                            <div>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </div>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}

function CollapsibleNavItem({ item, page }: { item: NavItem; page: ReturnType<typeof usePage> }) {
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    const isActive = item.items?.some((subItem: NavItem) => 
        subItem.href && (page.url === subItem.href || page.url.startsWith(subItem.href as string, 1))
    );
    const [open, setOpen] = useState(isActive || false);

    // When sidebar is collapsed, use DropdownMenu
    if (isCollapsed) {
        return (
            <DropdownMenu>
                <SidebarMenuItem>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            isActive={isActive}
                            tooltip={{ children: item.title }}
                        >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="right"
                        align="start"
                        sideOffset={8}
                        className="min-w-[12rem]"
                    >
                        {item.items?.map((subItem: NavItem) => (
                            subItem.href && (
                                <DropdownMenuItem key={subItem.title} asChild>
                                    <Link
                                        href={subItem.href}
                                        prefetch
                                        className="flex items-center gap-2"
                                    >
                                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                        <span>{subItem.title}</span>
                                    </Link>
                                </DropdownMenuItem>
                            )
                        ))}
                    </DropdownMenuContent>
                </SidebarMenuItem>
            </DropdownMenu>
        );
    }

    // When sidebar is expanded, use Collapsible
    return (
        <Collapsible open={open} onOpenChange={setOpen} asChild>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        isActive={isActive}
                        tooltip={{ children: item.title }}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight
                            className="ml-auto transition-transform duration-200"
                            style={{
                                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                            }}
                        />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items?.map((subItem: NavItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                {subItem.href && (
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={page.url === subItem.href || page.url.startsWith(subItem.href as string, 1)}
                                    >
                                        <Link href={subItem.href} prefetch>
                                            {subItem.icon && <subItem.icon />}
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                )}
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
