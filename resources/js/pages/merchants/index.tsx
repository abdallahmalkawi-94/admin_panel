import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type Merchant,
    type MerchantStatus,
    type PaginatedResourceCollection,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus, Store, Rocket, ShieldCheck, Users } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Merchants',
        href: '/merchants',
    },
];

// Merchant Status Constants (matching backend)
const MERCHANT_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    PENDING: 3,
    SUSPENDED: 4,
} as const;

interface Filters {
    name?: string;
    status_id?: string;
    product_id?: string;
    is_live?: string;
}

interface Product {
    id: number;
    en_name: string;
    ar_name: string;
}

interface IndexProps {
    merchants: PaginatedResourceCollection<Merchant>;
    filters: Filters;
    statuses: MerchantStatus[];
    products: Product[];
}

// Helper function to get badge variant based on status
const getStatusVariant = (
    statusId: number,
): 'success' | 'dark' | 'info' | 'destructive' | 'secondary' => {
    switch (statusId) {
        case MERCHANT_STATUS.ACTIVE:
            return 'success'; // Green
        case MERCHANT_STATUS.INACTIVE:
            return 'dark'; // Black
        case MERCHANT_STATUS.PENDING:
            return 'info'; // Blue
        case MERCHANT_STATUS.SUSPENDED:
            return 'destructive'; // Red
        default:
            return 'secondary';
    }
};

export default function Index({
    merchants,
    filters,
    statuses,
    products,
}: IndexProps) {
    const liveCount = merchants.data.filter((merchant) => merchant.is_live).length;
    const testCount = merchants.data.filter((merchant) => !merchant.is_live).length;
    const activeCount = merchants.data.filter((merchant) => merchant.status_id === MERCHANT_STATUS.ACTIVE).length;

    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/merchants',
        initialFilters: filters,
        perPage: merchants.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/merchants',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<Merchant>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (merchant) => (
                <Link
                    href={`/merchants/${merchant.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {merchant.id}
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
            key: 'parent_merchant',
            label: 'Parent Merchant',
            render: (merchant) => merchant.parent_merchant?.en_name || 'N/A',
        },
        {
            key: 'product',
            label: 'Product',
            render: (merchant) => merchant.product?.en_name || '-',
        },
        {
            key: 'status',
            label: 'Status',
            render: (merchant) => (
                <Badge variant={getStatusVariant(merchant.status_id)}>
                    {merchant.status?.description}
                </Badge>
            ),
        },
        {
            key: 'environment',
            label: 'Environment',
            render: (merchant) => (
                <Badge variant={merchant.is_live ? 'success' : 'info'}>
                    {merchant.is_live ? 'Live' : 'Test'}
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
            key: 'status_id',
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
        {
            key: 'product_id',
            label: 'Product',
            type: 'select',
            placeholder: 'All products',
            options: [
                { value: 'all', label: 'All products' },
                ...products.map((product) => ({
                    value: product.id.toString(),
                    label: product.en_name,
                })),
            ],
        },
        {
            key: 'is_live',
            label: 'Environment',
            type: 'select',
            placeholder: 'All',
            options: [
                { value: 'all', label: 'All' },
                { value: '1', label: 'Live' },
                { value: '0', label: 'Test' },
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Merchants" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Store className="h-4 w-4" />
                                Merchant Directory
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Merchants
                            </h1>
                            <p className="text-muted-foreground">
                                Monitor onboarding, live status, and product alignment at a glance.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/merchants/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Merchant
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
                                    Total Merchants
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {merchants.meta.total}
                                </p>
                            </div>
                            <Users className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Live (This Page)
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {liveCount}
                                </p>
                            </div>
                            <Rocket className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Test (This Page)
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {testCount}
                                </p>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-sky-600" />
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
                            <Store className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <DataFilters
                    title="Filter Merchants"
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Data Table */}
                <DataTable
                    title="All Merchants"
                    description="A list of all merchants including their name, product, and status."
                    data={merchants}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No merchants found."
                />
            </div>
        </AppLayout>
    );
}
