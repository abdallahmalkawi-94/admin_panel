import { router } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';

interface UseFiltersOptions<T extends Record<string, any>> {
    /**
     * The route to navigate to when applying filters
     */
    route: string;
    
    /**
     * Initial filter values from the server
     */
    initialFilters: T;
    
    /**
     * Current per_page value for pagination
     */
    perPage?: number;
    
    /**
     * Additional query parameters to preserve
     */
    preserveParams?: Record<string, any>;
}

interface UseFiltersReturn<T extends Record<string, any>> {
    /**
     * Current filter values
     */
    filters: T;
    
    /**
     * Update a single filter value
     */
    handleFilterChange: (key: string, value: string) => void;
    
    /**
     * Apply filters and navigate to route
     */
    handleSearch: () => void;
    
    /**
     * Clear all filters and navigate to route
     */
    clearFilters: () => void;
    
    /**
     * Check if any filters are active
     */
    hasActiveFilters: boolean;
}

/**
 * Custom hook for managing filter state and navigation
 * 
 * @example
 * ```tsx
 * const { filters, handleFilterChange, handleSearch, clearFilters, hasActiveFilters } = useFilters({
 *   route: '/users',
 *   initialFilters: { name: '', email: '', status_id: '' },
 *   perPage: users.meta.per_page,
 * });
 * ```
 */
export function useFilters<T extends Record<string, any>>({
    route,
    initialFilters,
    perPage,
    preserveParams = {},
}: UseFiltersOptions<T>): UseFiltersReturn<T> {
    // Initialize filters with empty strings for any undefined values
    const [filters, setFilters] = useState<T>(() => {
        const initialized = {} as T;
        for (const key in initialFilters) {
            initialized[key] = initialFilters[key] || '';
        }
        return initialized;
    });

    /**
     * Update a single filter value
     * Converts "all" to empty string for proper filtering
     */
    const handleFilterChange = useCallback((key: string, value: string) => {
        const filterValue = value === 'all' ? '' : value;
        setFilters((prev) => ({ ...prev, [key]: filterValue }));
    }, []);

    /**
     * Apply filters by navigating to the route with current filter values
     */
    const handleSearch = useCallback(() => {
        const params: Record<string, any> = { ...filters, ...preserveParams };
        
        // Add per_page if provided
        if (perPage) {
            params.per_page = perPage;
        }

        router.get(route, params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters, route, perPage, preserveParams]);

    /**
     * Clear all filters and navigate to the route with empty filters
     */
    const clearFilters = useCallback(() => {
        // Reset all filters to empty strings
        const emptyFilters = {} as T;
        for (const key in initialFilters) {
            emptyFilters[key] = '' as any;
        }
        setFilters(emptyFilters);

        // Navigate with only perPage and preserved params
        const params: Record<string, any> = { ...preserveParams };
        if (perPage) {
            params.per_page = perPage;
        }

        router.get(route, params);
    }, [route, initialFilters, perPage, preserveParams]);

    /**
     * Check if any filter has an active value
     */
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some((value) => value !== '');
    }, [filters]);

    return {
        filters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    };
}

