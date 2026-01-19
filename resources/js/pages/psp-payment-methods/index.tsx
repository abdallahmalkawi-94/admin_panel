import AppLayout from '@/layouts/app-layout';
import {
    type PspPaymentMethod,
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
        title: 'PSP Payment Methods',
        href: '/psp-payment-methods',
    },
];

interface Filters {
    psp_id?: string;
    payment_method_id?: string;
    is_active?: string;
}

interface IndexProps {
    pspPaymentMethods: PaginatedResourceCollection<PspPaymentMethod>;
    filters: Filters;
}

export default function Index({ pspPaymentMethods, filters }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/psp-payment-methods',
        initialFilters: filters,
        perPage: pspPaymentMethods.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/psp-payment-methods',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<PspPaymentMethod>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (pspPaymentMethod) => (
                <Link
                    href={`/psp-payment-methods/${pspPaymentMethod.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {pspPaymentMethod.id}
                </Link>
            ),
        },
        {
            key: 'psp',
            label: 'PSP',
            render: (pspPaymentMethod) => (
                <span>{pspPaymentMethod.psp?.name || 'N/A'}</span>
            ),
        },
        {
            key: 'payment_method',
            label: 'Payment Method',
            render: (pspPaymentMethod) => (
                <span>{pspPaymentMethod.payment_method?.description || 'N/A'}</span>
            ),
        },
        {
            key: 'priority',
            label: 'Priority',
        },
        {
            key: 'is_active',
            label: 'Active',
            render: (pspPaymentMethod) => (
                <span className={pspPaymentMethod.is_active ? 'text-green-600' : 'text-gray-500'}>
                    {pspPaymentMethod.is_active ? 'Yes' : 'No'}
                </span>
            ),
        },
    ];

    // Define filter fields
    // const filterFields: FilterField[] = [
    //     {
    //         key: 'is_active',
    //         label: 'Active',
    //         type: 'select',
    //         placeholder: 'All',
    //         options: [
    //             { value: 'all', label: 'All' },
    //             { value: '1', label: 'Yes' },
    //             { value: '0', label: 'No' },
    //         ],
    //     },
    // ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PSP Payment Methods" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            PSP Payment Methods
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all PSP payment methods in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/psp-payment-methods/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add PSP Payment Method
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                {/*<DataFilters*/}
                {/*    fields={filterFields}*/}
                {/*    values={searchFilters}*/}
                {/*    onChange={handleFilterChange}*/}
                {/*    onSearch={handleSearch}*/}
                {/*    onClear={clearFilters}*/}
                {/*    hasActiveFilters={hasActiveFilters}*/}
                {/*/>*/}

                {/* Data Table */}
                <DataTable
                    title="All PSP Payment Methods"
                    description="A list of all PSP payment methods with their details."
                    data={pspPaymentMethods}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No PSP payment methods found."
                />
            </div>
        </AppLayout>
    );
}
