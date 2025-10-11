import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResourceCollection, type User, type UserStatus } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, type Column, type Action } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { UserPlus } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';

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

interface Country {
    code: string;
    name: string;
}

interface IndexProps {
    users: PaginatedResourceCollection<User>;
    filters: Filters;
    statuses: UserStatus[];
    countries: Country[];
}

// Helper function to get badge variant based on status
const getStatusVariant = (statusId: number): 'success' | 'dark' | 'info' | 'destructive' | 'secondary' => {
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

export default function Index({ users, filters, statuses, countries }: IndexProps) {
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
            }
        );
    };

    // Define table columns
    const columns: Column<User>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
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

    // Define table actions
    const actions: Action<User>[] = [
        {
            label: 'View',
            href: (user) => `/users/${user.id}`,
            variant: 'ghost',
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                        <p className="text-muted-foreground">
                            Manage and view all users in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/users/create">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add User
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
                    title="All Users"
                    description="A list of all users including their name, email, and contact information."
                    data={users}
                    columns={columns}
                    actions={actions}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No users found."
                />
            </div>
        </AppLayout>
    );
}
