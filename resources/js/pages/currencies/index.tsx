import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Currency, type PaginatedResourceCollection } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Currencies',
        href: '/currencies',
    },
];

interface Filters {
    name?: string;
    code?: string;
}

interface IndexProps {
    currencies: PaginatedResourceCollection<Currency>;
    filters: Filters;
}

export default function Index({ currencies, filters }: IndexProps) {
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/currencies',
        initialFilters: filters,
        perPage: currencies.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/currencies',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const columns: Column<Currency>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (currency) => (
                <Link
                    href={`/currencies/${currency.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {currency.id}
                </Link>
            ),
        },
        {
            key: 'code',
            label: 'Code',
            render: (currency) => (
                <span className="font-mono font-semibold">{currency.code}</span>
            ),
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'symbol',
            label: 'Symbol',
            render: (currency) => (
                <div className="flex items-center gap-2">
                    <span className="text-lg">{currency.symbol}</span>
                    <span className="text-sm text-muted-foreground">
                        ({currency.symbol_native})
                    </span>
                </div>
            ),
        },
        {
            key: 'country_name',
            label: 'Country',
            render: (currency) => currency.country_name || '-',
        },
    ];

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
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Currencies" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Currencies
                        </h1>
                        <p className="text-muted-foreground">
                            View all currencies in the system
                        </p>
                    </div>
                </div>

                <DataFilters
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                <DataTable
                    title="All Currencies"
                    description="A list of all currencies including their codes, symbols, and countries."
                    data={currencies}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No currencies found."
                />
            </div>
        </AppLayout>
    );
}

