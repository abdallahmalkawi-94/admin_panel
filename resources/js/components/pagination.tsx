import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginationLink } from '@/types';

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
    preserveQuery?: Record<string, string | number>;
}

export function Pagination({ links, className, preserveQuery = {} }: PaginationProps) {
    // Helper function to append query parameters to URL
    const appendQueryParams = (url: string | null): string | null => {
        if (!url) return null;
        
        const urlObj = new URL(url);
        Object.entries(preserveQuery).forEach(([key, value]) => {
            urlObj.searchParams.set(key, value.toString());
        });
        
        return urlObj.toString();
    };

    return (
        <div className={cn('flex items-center justify-center gap-1', className)}>
            {links.map((link, index) => {
                const preservedUrl = appendQueryParams(link.url);
                // Handle Previous button
                if (index === 0) {
                    return (
                        <Button
                            key="prev"
                            variant="outline"
                            size="icon"
                            disabled={!preservedUrl}
                            asChild={!!preservedUrl}
                        >
                            {preservedUrl ? (
                                <Link href={preservedUrl} preserveScroll>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </Button>
                    );
                }

                // Handle Next button
                if (index === links.length - 1) {
                    return (
                        <Button
                            key="next"
                            variant="outline"
                            size="icon"
                            disabled={!preservedUrl}
                            asChild={!!preservedUrl}
                        >
                            {preservedUrl ? (
                                <Link href={preservedUrl} preserveScroll>
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    );
                }

                // Handle numbered pages
                return (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        size="icon"
                        disabled={!preservedUrl}
                        asChild={!!preservedUrl}
                        className={cn(link.active && 'pointer-events-none')}
                    >
                        {preservedUrl ? (
                            <Link href={preservedUrl} preserveScroll>
                                {link.label}
                            </Link>
                        ) : (
                            <span>{link.label}</span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}

