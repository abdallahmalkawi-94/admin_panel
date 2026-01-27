import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PaginatedResourceCollection,
    type User,
    type UserStatus,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus, Users, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';
import { CountryDropDown } from '@/types/dropdown';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

// User Status Constants (matching backend)
const USER_STATUS = {
    ACTIVE: 1,
    IN_ACTIVE: 2,
    PENDING_VERIFICATION: 3,
    BLOCKED: 4,
} as const;

interface Filters {
    name?: string;
    email?: string;
    phone?: string;
    status_id?: string;
    country_code?: string;
}

interface IndexProps {
    users: PaginatedResourceCollection<User>;
    filters: Filters;
    statuses: UserStatus[];
    countries: CountryDropDown[];
}

// Helper function to get badge variant based on status
const getStatusVariant = (
    statusId: number,
): 'success' | 'dark' | 'info' | 'destructive' | 'secondary' => {
    switch (statusId) {
        case USER_STATUS.ACTIVE:
            return 'success'; // Green
        case USER_STATUS.IN_ACTIVE:
            return 'dark'; // Black
        case USER_STATUS.PENDING_VERIFICATION:
            return 'info'; // Blue
        case USER_STATUS.BLOCKED:
            return 'destructive'; // Red
        default:
            return 'secondary';
    }
};

export default function Index({
    users,
    filters,
    statuses,
    countries,
}: IndexProps) {
    const activeCount = users.data.filter(
        (user) => user.status_id === USER_STATUS.ACTIVE,
    ).length;
    const pendingCount = users.data.filter(
        (user) => user.status_id === USER_STATUS.PENDING_VERIFICATION,
    ).length;
    const blockedCount = users.data.filter(
        (user) => user.status_id === USER_STATUS.BLOCKED,
    ).length;

    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/users',
        initialFilters: filters,
        perPage: users.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/users',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<User>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (user) => (
                <Link
                    href={`/users/${user.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {user.id}
                </Link>
            ),
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (user) =>
                user.country_code && user.mobile_number
                    ? `${user.country_code} ${user.mobile_number}`
                    : '-',
        },
        {
            key: 'status',
            label: 'Status',
            render: (user) => (
                <Badge variant={getStatusVariant(user.status_id)}>
                    {user.status.description}
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
            key: 'email',
            label: 'Email',
            type: 'text',
            placeholder: 'Search by email...',
        },
        {
            key: 'phone',
            label: 'Phone',
            type: 'text',
            placeholder: 'Search by phone...',
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
            key: 'country_code',
            label: 'Country',
            type: 'select',
            placeholder: 'All countries',
            options: [
                { value: 'all', label: 'All countries' },
                ...countries.map((country) => ({
                    value: country.code,
                    label: country.name,
                })),
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-500/10 via-emerald-400/10 to-amber-400/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-sky-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Users className="h-4 w-4" />
                                User Directory
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Users
                            </h1>
                            <p className="text-muted-foreground">
                                Track user activity, verification status, and access health.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/users/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
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
                                    Total Users
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {users.meta.total}
                                </p>
                            </div>
                            <Users className="h-5 w-5 text-emerald-600" />
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
                                    Pending (This Page)
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {pendingCount}
                                </p>
                            </div>
                            <Clock className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Blocked (This Page)
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {blockedCount}
                                </p>
                            </div>
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <DataFilters
                    title="Filter Users"
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Data Table */}
                <DataTable
                    title="All Users"
                    description="A list of all users including their name, email, and contact information."
                    data={users}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No users found."
                />
            </div>
        </AppLayout>
    );
}
