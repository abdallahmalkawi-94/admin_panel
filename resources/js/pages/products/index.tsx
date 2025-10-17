import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type PaginatedResourceCollection,
    type Product,
} from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { Plus } from 'lucide-react';
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Products
                        </h1>
                        <p className="text-muted-foreground">
                            Manage and view all products in the system
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
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
