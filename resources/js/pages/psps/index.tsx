import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type Psp,
    type PspStatus,
    type Country,
    type PaginatedResourceCollection,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSPs',
        href: '/psps',
    },
];

interface Filters {
    name?: string;
    code?: string;
    country_id?: string;
    psp_status_id?: string;
}

interface IndexProps {
    psps: PaginatedResourceCollection<Psp>;
    filters: Filters;
    statuses: PspStatus[];
    countries: Country[];
}

export default function Index({
    psps,
    filters,
    statuses,
    countries,
}: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/psps',
        initialFilters: filters,
        perPage: psps.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/psps',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<Psp>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (psp) => (
                <Link
                    href={`/psps/${psp.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {psp.id}
                </Link>
            ),
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'code',
            label: 'Code',
            render: (psp) => (
                <code className="rounded bg-muted px-2 py-1 text-sm">
                    {psp.code}
                </code>
            ),
        },
        {
            key: 'country',
            label: 'Country',
            render: (psp) => psp.country?.name || '-',
        },
        {
            key: 'settlement_currency',
            label: 'Currency',
            render: (psp) =>
                psp.settlement_currency
                    ? `${psp.settlement_currency.code} (${psp.settlement_currency.symbol})`
                    : '-',
        },
        {
            key: 'monthly_fees',
            label: 'Monthly Fees',
            render: (psp) => `${psp.monthly_fees}`,
        },
        {
            key: 'status',
            label: 'Status',
            render: (psp) => (
                <Badge variant="info">{psp.status?.description}</Badge>
            ),
        },
        {
            key: 'support_money_splitting',
            label: 'Money Splitting',
            render: (psp) => (
                <Badge variant={psp.support_money_splitting ? 'success' : 'secondary'}>
                    {psp.support_money_splitting ? 'Yes' : 'No'}
                </Badge>
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
        {
            key: 'code',
            label: 'Code',
            type: 'text',
            placeholder: 'Search by code...',
        },
        {
            key: 'country_id',
            label: 'Country',
            type: 'select',
            placeholder: 'All countries',
            options: [
                { value: 'all', label: 'All countries' },
                ...countries.map((country) => ({
                    value: country?.id?.toString(),
                    label: country.name,
                })),
            ],
        },
        {
            key: 'psp_status_id',
            label: 'Status',
            type: 'select',
            placeholder: 'All statuses',
            options: [
                { value: 'all', label: 'All statuses' },
                ...statuses.map((status) => ({
                    value: status.id.toString(),
                    label: status.description,
                })),
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="PSPs" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment Service Providers
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all PSPs in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/psps/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add PSP
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
                    title="All PSPs"
                    description="A list of all payment service providers including their details."
                    data={psps}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No PSPs found."
                />
            </div>
        </AppLayout>
    );
}

