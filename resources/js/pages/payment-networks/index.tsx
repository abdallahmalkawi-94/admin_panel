import AppLayout from '@/layouts/app-layout';
import {
    type PaymentNetwork,
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
        title: 'Payment Networks',
        href: '/payment-networks',
    },
];

interface Filters {
    name?: string;
}

interface IndexProps {
    paymentNetworks: PaginatedResourceCollection<PaymentNetwork>;
    filters: Filters;
}

export default function Index({ paymentNetworks, filters }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/payment-networks',
        initialFilters: filters,
        perPage: paymentNetworks.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/payment-networks',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<PaymentNetwork>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (paymentNetwork) => (
                <Link
                    href={`/payment-networks/${paymentNetwork.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {paymentNetwork.id}
                </Link>
            ),
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'tags',
            label: 'Tags',
            render: (paymentNetwork) => (
                <div className="flex flex-wrap gap-1">
                    {paymentNetwork.tags && paymentNetwork.tags.length > 0 ? (
                        paymentNetwork.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            ),
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
            <Head title="Payment Networks" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment Networks
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all payment networks in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/payment-networks/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment Network
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
                    title="All Payment Networks"
                    description="A list of all payment networks with their details."
                    data={paymentNetworks}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No payment networks found."
                />
            </div>
        </AppLayout>
    );
}
