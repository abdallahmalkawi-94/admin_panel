import AppLayout from '@/layouts/app-layout';
import {
    type InvoiceType,
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
        title: 'Invoice Types',
        href: '/invoice-types',
    },
];

interface Filters {
    description?: string;
    code?: string;
}

interface IndexProps {
    invoiceTypes: PaginatedResourceCollection<InvoiceType>;
    filters: Filters;
}

export default function Index({ invoiceTypes, filters }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/invoice-types',
        initialFilters: filters,
        perPage: invoiceTypes.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/invoice-types',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<InvoiceType>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (invoiceType) => (
                <Link
                    href={`/invoice-types/${invoiceType.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {invoiceType.id}
                </Link>
            ),
        },
        {
            key: 'code',
            label: 'Code',
            render: (invoiceType) => (
                <span className="text-sm">{invoiceType.code}</span>
            ),
        },
        {
            key: 'description',
            label: 'Description',
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
            <Head title="Invoice Types" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Invoice Types
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all invoice types in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/invoice-types/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Invoice Type
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
                    title="All Invoice Types"
                    description="A list of all invoice types with their details."
                    data={invoiceTypes}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No invoice types found."
                />
            </div>
        </AppLayout>
    );
}
