import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Country, type PaginatedResourceCollection } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Countries',
        href: '/countries',
    },
];

interface Filters {
    name?: string;
    region?: string;
    iso2?: string;
    status?: string;
}

interface IndexProps {
    countries: PaginatedResourceCollection<Country>;
    filters: Filters;
    regions: string[];
}

// Helper function to get badge variant based on status
const getStatusVariant = (
    status: number,
): 'success' | 'destructive' | 'secondary' => {
    switch (status) {
        case 1:
            return 'success'; // Active
        case 0:
            return 'destructive'; // Inactive
        default:
            return 'secondary';
    }
};

export default function Index({ countries, filters, regions }: IndexProps) {
    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/countries',
        initialFilters: filters,
        perPage: countries.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/countries',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<Country>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (country) => (
                <Link
                    href={`/countries/${country.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {country.id}
                </Link>
            ),
        },
        {
            key: 'iso2',
            label: 'ISO2',
            render: (country) => (
                <span className="font-mono text-sm">{country.iso2}</span>
            ),
        },
        {
            key: 'iso3',
            label: 'ISO3',
            render: (country) => (
                <span className="font-mono text-sm">{country.iso3}</span>
            ),
        },
        {
            key: 'name',
            label: 'Name',
            render: (country) => (
                <div className="flex items-center gap-2">
                    {country.emoji && (
                        <span className="text-xl">{country.emoji}</span>
                    )}
                    <span>{country.name}</span>
                </div>
            ),
        },
        {
            key: 'phone_code',
            label: 'Phone Code',
            render: (country) => country.phone_code || '-',
        },
        {
            key: 'region',
            label: 'Region',
            render: (country) => country.region || '-',
        },
        {
            key: 'subregion',
            label: 'subregion',
            render: (country) => country.subregion || '-',
        },
        {
            key: 'status',
            label: 'Status',
            render: (country) => (
                <Badge variant={getStatusVariant(country.status)}>
                    {country.status === 1 ? 'Active' : 'Inactive'}
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
            key: 'iso2',
            label: 'ISO2 Code',
            type: 'text',
            placeholder: 'Search by ISO2...',
        },
        {
            key: 'region',
            label: 'Region',
            type: 'select',
            placeholder: 'All regions',
            options: [
                { value: 'all', label: 'All regions' },
                ...regions.map((region) => ({
                    value: region,
                    label: region,
                })),
            ],
        },
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            placeholder: 'All statuses',
            options: [
                { value: 'all', label: 'All statuses' },
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' },
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Countries" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Countries
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all countries in the system
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
                    title="All Countries"
                    description="A list of all countries including their ISO codes, regions, and status."
                    data={countries}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No countries found."
                />
            </div>
        </AppLayout>
    );
}
