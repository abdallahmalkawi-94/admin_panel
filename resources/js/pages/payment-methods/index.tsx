import AppLayout from '@/layouts/app-layout';
import {
    type PaymentMethod,
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
        title: 'Payment Methods',
        href: '/payment-methods',
    },
];

interface Filters {
    description?: string;
    is_one_time_payment?: string;
}

interface IndexProps {
    paymentMethods: PaginatedResourceCollection<PaymentMethod>;
    filters: Filters;
}

export default function Index({ paymentMethods, filters }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/payment-methods',
        initialFilters: filters,
        perPage: paymentMethods.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/payment-methods',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<PaymentMethod>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (paymentMethod) => (
                <Link
                    href={`/payment-methods/${paymentMethod.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {paymentMethod.id}
                </Link>
            ),
        },
        {
            key: 'description',
            label: 'Description',
        },
        {
            key: 'code',
            label: 'Code',
        },
        {
            key: 'is_one_time_payment',
            label: 'One Time Payment',
            render: (paymentMethod) => (
                <span className={paymentMethod.is_one_time_payment ? 'text-green-600' : 'text-gray-500'}>
                    {paymentMethod.is_one_time_payment ? 'Yes' : 'No'}
                </span>
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
            key: 'is_one_time_payment',
            label: 'One Time Payment',
            type: 'select',
            placeholder: 'All',
            options: [
                { value: 'all', label: 'All' },
                { value: '1', label: 'Yes' },
                { value: '0', label: 'No' },
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Methods" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment Methods
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all payment methods in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/payment-methods/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Payment Method
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
                    title="All Payment Methods"
                    description="A list of all payment methods with their details."
                    data={paymentMethods}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No payment methods found."
                />
            </div>
        </AppLayout>
    );
}
