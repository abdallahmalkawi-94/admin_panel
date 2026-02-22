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
import { Card, CardContent } from '@/components/ui/card';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus, Banknote, ShieldCheck, Split, Globe } from 'lucide-react';
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
    const activeCount = psps.data.filter((psp) => psp.status?.description?.toLowerCase().includes('active')).length;
    const splittingCount = psps.data.filter((psp) => psp.support_money_splitting).length;
    const autoTransferCount = psps.data.filter((psp) => psp.enable_auto_transfer).length;

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
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Banknote className="h-4 w-4" />
                                PSP Directory
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Payment Service Providers
                            </h1>
                            <p className="text-muted-foreground">
                                Track status, settlement, and configuration.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/psps/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add PSP
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Snapshot */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Total PSPs
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {psps.meta.total}
                                </p>
                            </div>
                            <Globe className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Active (This Page)
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {activeCount}
                                </p>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Money Splitting
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {splittingCount}
                                </p>
                            </div>
                            <Split className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Auto Transfer
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {autoTransferCount}
                                </p>
                            </div>
                            <Banknote className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <DataFilters
                    title="Filter PSPs"
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
