import { type Column, DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResourceCollection, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Lock, Plus, Search } from 'lucide-react';
import { type FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

interface Filters {
    name?: string;
}

interface IndexProps {
    roles: PaginatedResourceCollection<Role>;
    filters: Filters;
}

export default function Index({ roles, filters }: IndexProps) {
    const [name, setName] = useState(filters.name || '');

    const handlePerPageChange = (value: string) => {
        router.get(
            '/roles',
            { ...filters, per_page: value },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSearch: FormEventHandler = (event) => {
        event.preventDefault();

        router.get(
            '/roles',
            { name },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const columns: Column<Role>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
        },
        {
            key: 'name',
            label: 'Roles',
        },
        {
            key: 'guard_name',
            label: 'Guard',
        },
        {
            key: 'permissions_count',
            label: 'Permissions',
            render: (role) => role.permissions_count ?? 0,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-sky-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                <Lock className="h-4 w-4" />
                                Role Directory
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Roles
                            </h1>
                            <p className="text-muted-foreground">
                                Track roles and their defined permissions.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/roles/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Role
                            </Link>
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-wrap items-center gap-3 rounded-lg border bg-background p-4"
                >
                    <div className="relative min-w-64 flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Search roles by name"
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit" variant="outline">
                        Search
                    </Button>
                </form>

                {/* Data Table */}
                <DataTable
                    title="All Roles"
                    description="A list of all roles."
                    data={roles}
                    columns={columns}
                    getRowHref={(role) => `/roles/${role.id}`}
                    searchFilters={filters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No roles found."
                />
            </div>
        </AppLayout>
    );
}
