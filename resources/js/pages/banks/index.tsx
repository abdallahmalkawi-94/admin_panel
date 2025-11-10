import AppLayout from '@/layouts/app-layout';
import {
    type Bank,
    type BreadcrumbItem,
    type PaginatedResourceCollection,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banks',
        href: '/banks',
    },
];

interface Filters {
    name?: string;
}

interface IndexProps {
    banks: PaginatedResourceCollection<Bank>;
    filters: Filters;
}

export default function Index({ banks, filters }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/banks',
        initialFilters: filters,
        perPage: banks.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/banks',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<Bank>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (bank) => (
                <Link
                    href={`/banks/${bank.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {bank.id}
                </Link>
            ),
        },
        {
            key: 'en_name',
            label: 'English Name',
        },
        {
            key: 'ar_name',
            label: 'Arabic Name',
        },
        {
            key: 'swift_code',
            label: 'SWIFT Code',
            render: (bank) => bank.swift_code || '-',
        },
    ];

    // Define filter fields
    const filterFields: FilterField[] = [
        {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Search by name...',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Banks" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Banks
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all banks in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/banks/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Bank
                        </Link>
                    </Button>
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
                    title="All Banks"
                    description="A list of all banks with their details."
                    data={banks}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No banks found."
                />
            </div>
        </AppLayout>
    );
}

