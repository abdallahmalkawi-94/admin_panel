import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PaginatedResourceCollection,
    type Product,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus, Package, ShieldCheck, ShieldOff } from 'lucide-react';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Filters {
    name?: string;
}
interface IndexProps {
    products: PaginatedResourceCollection<Product>;
    filters: Filters;
}

export default function Index({ products, filters }: IndexProps) {
    const signingActiveCount = products.data.filter(
        (product) => product.signing_active,
    ).length;
    const signingInactiveCount = products.data.filter(
        (product) => !product.signing_active,
    ).length;

    // Use the reusable filters hook
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/products',
        initialFilters: filters,
        perPage: products.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/products',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    // Define table columns
    const columns: Column<Product>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
            render: (product) => (
                <Link
                    href={`/products/${product.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                    {product.id}
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
    ];

    // Define filter fields
    const filterFields: FilterField[] = [
        {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Search by name...',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Package className="h-4 w-4" />
                                Product Catalog
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Products
                            </h1>
                            <p className="text-muted-foreground">
                                Manage integrations, signing status, and API endpoints.
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/products/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Snapshot */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Total Products
                                </p>
                                <p className="mt-2 text-2xl font-semibold">
                                    {products.meta.total}
                                </p>
                            </div>
                            <Package className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                </div>

                <DataFilters
                    title="Filter Products"
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Data Table */}
                <DataTable
                    title="All Products"
                    description="A list of all products."
                    data={products}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No products found."
                />
            </div>
        </AppLayout>
    );
}
