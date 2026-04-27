import { DataFilters, type FilterField } from '@/components/data-filters';
import { type Column, DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFilters } from '@/hooks/use-filters';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PaginatedResourceCollection,
    type PayerProfile,
} from '@/types';
import { Head, router } from '@inertiajs/react';
import { BadgeCheck, CircleDollarSign, IdCard, UserRound } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payer Profiles',
        href: '/payer-profiles',
    },
];

const PAYER_PROFILE_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    PENDING: 3,
    SUSPENDED: 4,
} as const;

const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' },
    { value: '3', label: 'Pending' },
    { value: '4', label: 'Suspended' },
];

interface Filters {
    name?: string;
    username?: string;
    email?: string;
    mobile_number?: string;
    status?: string;
    product_id?: string;
    merchant_id?: string;
}

interface LookupOption {
    id: number;
    en_name: string;
    ar_name: string;
}

interface IndexProps {
    payerProfiles: PaginatedResourceCollection<PayerProfile>;
    filters: Filters;
    products: LookupOption[];
    merchants: LookupOption[];
}

const getStatusLabel = (status: number) => {
    switch (status) {
        case PAYER_PROFILE_STATUS.ACTIVE:
            return 'Active';
        case PAYER_PROFILE_STATUS.INACTIVE:
            return 'Inactive';
        case PAYER_PROFILE_STATUS.PENDING:
            return 'Pending';
        case PAYER_PROFILE_STATUS.SUSPENDED:
            return 'Suspended';
        default:
            return `Status ${status}`;
    }
};

const getStatusVariant = (
    status: number,
): 'success' | 'dark' | 'info' | 'destructive' | 'secondary' => {
    switch (status) {
        case PAYER_PROFILE_STATUS.ACTIVE:
            return 'success';
        case PAYER_PROFILE_STATUS.INACTIVE:
            return 'dark';
        case PAYER_PROFILE_STATUS.PENDING:
            return 'info';
        case PAYER_PROFILE_STATUS.SUSPENDED:
            return 'destructive';
        default:
            return 'secondary';
    }
};

export default function Index({
    payerProfiles,
    filters,
    products,
    merchants,
}: IndexProps) {
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/payer-profiles',
        initialFilters: filters,
        perPage: payerProfiles.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/payer-profiles',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const columns: Column<PayerProfile>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
        },
        {
            key: 'full_name',
            label: 'Full Name',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'mobile_number',
            label: 'Mobile Number',
        },
        {
            key: 'product',
            label: 'Product',
            render: (payerProfile) => payerProfile.product?.en_name || '-',
        },
        {
            key: 'merchant',
            label: 'Merchant',
            render: (payerProfile) => payerProfile.merchant?.en_name || '-',
        },
    ];

    const filterFields: FilterField[] = [
        {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Search by full name...',
        },
        {
            key: 'username',
            label: 'Username',
            type: 'text',
            placeholder: 'Search by username...',
        },
        {
            key: 'email',
            label: 'Email',
            type: 'text',
            placeholder: 'Search by email...',
        },
        {
            key: 'mobile_number',
            label: 'Mobile Number',
            type: 'text',
            placeholder: 'Search by mobile...',
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
            key: 'merchant_id',
            label: 'Merchant',
            type: 'select',
            placeholder: 'All merchants',
            options: [
                { value: 'all', label: 'All merchants' },
                ...merchants.map((merchant) => ({
                    value: merchant.id.toString(),
                    label: merchant.en_name,
                })),
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payer Profiles" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div>
                        <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                            <UserRound className="h-4 w-4" />
                            Payer Directory
                        </div>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                            Payer Profiles
                        </h1>
                        <p className="text-muted-foreground">
                            Review payer identity, account status, and product
                            alignment.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Total Profiles
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {payerProfiles.meta.total}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                </div>

                <DataFilters
                    title="Filter Payer Profiles"
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                <DataTable
                    title="All Payer Profiles"
                    description="A list of payer profiles including account, product, merchant, and status information."
                    data={payerProfiles}
                    columns={columns}
                    getRowHref={(payerProfile) =>
                        `/payer-profiles/${payerProfile.id}`
                    }
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No payer profiles found."
                />
            </div>
        </AppLayout>
    );
}
