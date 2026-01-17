import AppLayout from '@/layouts/app-layout';
import {
    type MessageType,
    type BreadcrumbItem,
    type PaginatedResourceCollection,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Message Types',
        href: '/message-types',
    },
];

interface Filters {
    description?: string;
    code?: string;
}

interface IndexProps {
    messageTypes: PaginatedResourceCollection<MessageType>;
    filters: Filters;
}

export default function Index({ messageTypes, filters }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/message-types',
        initialFilters: filters,
        perPage: messageTypes.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/message-types',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<MessageType>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
        },
        {
            key: 'code',
            label: 'Code',
        },
        {
            key: 'description',
            label: 'Description',
        },
        {
            key: 'message_direction',
            label: 'Message Direction',
            render: (messageType) => (
                <span className="text-sm">{messageType.message_direction_label}</span>
            ),
        },
    ];

    // Define filter fields
    const filterFields: FilterField[] = [
        {
            key: 'description',
            label: 'Description',
            type: 'text',
            placeholder: 'Search by description...',
        },
        {
            key: 'code',
            label: 'Code',
            type: 'text',
            placeholder: 'Search by code...',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Message Types" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Message Types
                        </h1>
                        <p className="text-muted-foreground">
                            View all message types in the system
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <DataFilters
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Data Table */}
                <DataTable
                    title="All Message Types"
                    description="A list of all message types with their details."
                    data={messageTypes}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No message types found."
                />
            </div>
        </AppLayout>
    );
}
