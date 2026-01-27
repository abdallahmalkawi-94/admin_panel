import AppLayout from '@/layouts/app-layout';
import {
    type PspPaymentMethod,
    type BreadcrumbItem,
    type PaginatedResourceCollection,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus, CreditCard, ShieldCheck, Eye, Layers } from 'lucide-react';
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
    const activeCount = pspPaymentMethods.data.filter((method) => method.is_active).length;
    const shownCount = pspPaymentMethods.data.filter((method) => method.shown_in_checkout).length;
    const uniquePspCount = new Set(pspPaymentMethods.data.map((method) => method.psp?.id).filter(Boolean)).size;

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
            label: 'Status',
            render: (pspPaymentMethod) => (
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        pspPaymentMethod.is_active
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                    }`}
                >
                    {pspPaymentMethod.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

    // Define filter fields
    const filterFields: FilterField[] = [
        {
            key: 'is_active',
            label: 'Active',
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
            <Head title="PSP Payment Methods" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                PSP Payment Methods
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                PSP Payment Methods
                            </h1>
                            <p className="text-muted-foreground">
                                Manage activation, checkout visibility, and routing priority.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/psp-payment-methods/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add PSP Payment Method
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
                                    Total Methods
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {pspPaymentMethods.meta.total}
                                </p>
                            </div>
                            <Layers className="h-5 w-5 text-emerald-600" />
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
                                    Shown in Checkout
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {shownCount}
                                </p>
                            </div>
                            <Eye className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    PSP Coverage
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {uniquePspCount}
                                </p>
                            </div>
                            <CreditCard className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <DataFilters
                    title="Filter Payment Methods"
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

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
