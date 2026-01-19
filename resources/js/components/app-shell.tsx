import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;
    
    // Read cookie on client side first, fallback to server prop
    const [sidebarOpen, setSidebarOpen] = React.useState(() => {
        if (typeof document !== 'undefined') {
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('sidebar_state='))
                ?.split('=')[1];
            if (cookieValue !== undefined) {
                return cookieValue === 'true';
            }
        }
        return isOpen;
    });

    // Only sync with server prop on initial mount if no cookie exists
    // After that, cookie is the source of truth
    React.useEffect(() => {
        if (typeof document !== 'undefined') {
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('sidebar_state='))
                ?.split('=')[1];
            // Only update if cookie doesn't exist (first visit)
            if (cookieValue === undefined) {
                setSidebarOpen(isOpen);
            }
        }
    }, []); // Empty deps - only run on mount

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">{children}</div>
        );
    }

    return (
        <SidebarProvider 
            open={sidebarOpen} 
            onOpenChange={setSidebarOpen}
        >
            {children}
        </SidebarProvider>
    );
}
