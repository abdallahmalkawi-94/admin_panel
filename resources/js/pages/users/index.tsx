import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResourceCollection, type User, type UserStatus } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Pagination } from '@/components/pagination';
import { UserPlus, Search, X } from 'lucide-react';
import { useState, useCallback } from 'react';

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
    const [searchFilters, setSearchFilters] = useState<Filters>({
        name: filters.name || '',
        email: filters.email || '',
        phone: filters.phone || '',
        status_id: filters.status_id || '',
        country_code: filters.country_code || '',
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

    const handleSearch = useCallback(() => {
        router.get(
            '/users',
            { ...searchFilters, per_page: users.meta.per_page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    }, [searchFilters, users.meta.per_page]);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        // Convert "all" to empty string for filtering
        const filterValue = value === 'all' ? '' : value;
        const newFilters = { ...searchFilters, [key]: filterValue };
        setSearchFilters(newFilters);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearFilters = () => {
        setSearchFilters({
            name: '',
            email: '',
            phone: '',
            status_id: '',
            country_code: '',
        });
        router.get('/users', { per_page: users.meta.per_page });
    };

    const hasActiveFilters = Object.values(searchFilters).some(value => value !== '');

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


                {/* Search Filters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Search className="h-5 w-5 text-muted-foreground" />
                                <CardTitle>Search & Filter</CardTitle>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    placeholder="Search by name..."
                                    value={searchFilters.name}
                                    onChange={(e) => handleFilterChange('name', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    placeholder="Search by email..."
                                    value={searchFilters.email}
                                    onChange={(e) => handleFilterChange('email', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone</label>
                                <Input
                                    placeholder="Search by phone..."
                                    value={searchFilters.phone}
                                    onChange={(e) => handleFilterChange('phone', e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={searchFilters.status_id || 'all'}
                                    onValueChange={(value) => handleFilterChange('status_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        {statuses.map((status) => (
                                            <SelectItem key={status.id} value={status.id.toString()}>
                                                {status.description}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Country</label>
                                <Select
                                    value={searchFilters.country_code || 'all'}
                                    onValueChange={(value) => handleFilterChange('country_code', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All countries" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All countries</SelectItem>
                                        {countries.map((country) => (
                                            <SelectItem key={country.code} value={country.code}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Users</CardTitle>
                                <CardDescription>
                                    A list of all users including their name, email, and contact information.
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Show:</span>
                                <Select
                                    value={users.meta.per_page.toString()}
                                    onValueChange={handlePerPageChange}
                                >
                                    <SelectTrigger className="w-[80px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                        <SelectItem value="100">100</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.country_code && user.mobile_number
                                                    ? `${user.country_code} ${user.mobile_number}`
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(user.status_id)}>
                                                    {user.status.description}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/users/${user.id}`}>View</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        {users.meta.links && users.meta.links.length > 0 && (
                            <div className="mt-4">
                                <Pagination
                                    links={users.meta.links}
                                    preserveQuery={{
                                        per_page: users.meta.per_page,
                                        ...Object.fromEntries(
                                            Object.entries(searchFilters).filter(([, v]) => v !== '')
                                        ),
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
