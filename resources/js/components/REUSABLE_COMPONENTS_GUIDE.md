# Reusable Components Guide

This guide explains how to use the reusable DataTable and DataFilters components in any module.

## Components

### 1. DataTable
Location: `@/components/data-table`

A flexible, reusable table component with pagination and configurable columns/actions.

### 2. DataFilters  
Location: `@/components/data-filters`

A reusable filter component that supports text inputs, select dropdowns, and custom filters.

## Quick Start Example

Here's a complete example for a Products module:

```tsx
import { DataTable, type Column, type Action } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
}

export default function ProductsIndex({ products, filters, categories }) {
    const [searchFilters, setSearchFilters] = useState({
        name: filters.name || '',
        category: filters.category || '',
    });

    // Define table columns
    const columns: Column<Product>[] = [
        {
            key: 'id',
            label: 'ID',
            className: 'font-medium',
        },
        {
            key: 'name',
            label: 'Product Name',
        },
        {
            key: 'price',
            label: 'Price',
            render: (product) => `$${product.price.toFixed(2)}`,
        },
        {
            key: 'category',
            label: 'Category',
        },
        {
            key: 'stock',
            label: 'Stock',
            render: (product) => (
                <Badge variant={product.stock > 0 ? 'success' : 'destructive'}>
                    {product.stock}
                </Badge>
            ),
        },
    ];

    // Define table actions
    const actions: Action<Product>[] = [
        {
            label: 'Edit',
            href: (product) => `/products/${product.id}/edit`,
            variant: 'ghost',
        },
        {
            label: 'Delete',
            onClick: (product) => handleDelete(product.id),
            variant: 'destructive',
            show: (product) => product.stock === 0, // Conditional action
        },
    ];

    // Define filter fields
    const filterFields: FilterField[] = [
        {
            key: 'name',
            label: 'Product Name',
            type: 'text',
            placeholder: 'Search by name...',
        },
        {
            key: 'category',
            label: 'Category',
            type: 'select',
            options: [
                { value: 'all', label: 'All Categories' },
                ...categories.map(cat => ({
                    value: cat.id.toString(),
                    label: cat.name,
                })),
            ],
        },
    ];

    const handleSearch = () => {
        router.get('/products', { 
            ...searchFilters, 
            per_page: products.meta.per_page 
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const filterValue = value === 'all' ? '' : value;
        setSearchFilters({ ...searchFilters, [key]: filterValue });
    };

    const clearFilters = () => {
        setSearchFilters({ name: '', category: '' });
        router.get('/products', { per_page: products.meta.per_page });
    };

    const handlePageSizeChange = (size: string) => {
        router.get('/products', { 
            per_page: size, 
            ...searchFilters 
        });
    };

    return (
        <div className="flex flex-col gap-6 p-6">
            <DataFilters
                fields={filterFields}
                values={searchFilters}
                onChange={handleFilterChange}
                onSearch={handleSearch}
                onClear={clearFilters}
                hasActiveFilters={Object.values(searchFilters).some(v => v !== '')}
            />

            <DataTable
                title="Products"
                description="Manage your product inventory"
                data={products}
                columns={columns}
                actions={actions}
                searchFilters={searchFilters}
                onPageSizeChange={handlePageSizeChange}
                emptyMessage="No products found."
            />
        </div>
    );
}
```

## DataTable Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | Table title |
| `description` | string | No | Table description |
| `data` | PaginatedResourceCollection<T> | Yes | Paginated data from backend |
| `columns` | Column<T>[] | Yes | Column definitions |
| `actions` | Action<T>[] | No | Row action buttons |
| `searchFilters` | Record<string, any> | No | Current filter values for pagination |
| `onPageSizeChange` | (size: string) => void | No | Handler for page size change |
| `emptyMessage` | string | No | Message when no data |
| `headerActions` | ReactNode | No | Custom actions in header |

## Column Configuration

```tsx
interface Column<T> {
    key: string;              // Property key from data object
    label: string;            // Column header text
    className?: string;       // Optional CSS classes
    render?: (item: T) => ReactNode;  // Custom cell renderer
}
```

## Action Configuration

```tsx
interface Action<T> {
    label: string;                    // Button text
    href?: (item: T) => string;      // Link destination
    onClick?: (item: T) => void;     // Click handler
    variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary' | 'link';
    className?: string;               // Optional CSS classes
    show?: (item: T) => boolean;     // Conditional display
}
```

## DataFilters Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | No | Filter section title (default: "Search & Filter") |
| `fields` | FilterField[] | Yes | Filter field definitions |
| `values` | Record<string, any> | Yes | Current filter values |
| `onChange` | (key: string, value: any) => void | Yes | Filter change handler |
| `onSearch` | () => void | Yes | Search button click handler |
| `onClear` | () => void | Yes | Clear filters handler |
| `hasActiveFilters` | boolean | Yes | Show/hide clear button |
| `gridCols` | string | No | Tailwind grid classes |

## Filter Field Types

### Text Input
```tsx
{
    key: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Search...',
}
```

### Select Dropdown
```tsx
{
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
        { value: 'all', label: 'All Statuses' },
        { value: '1', label: 'Active' },
        { value: '2', label: 'Inactive' },
    ],
}
```

### Custom Filter
```tsx
{
    key: 'date_range',
    label: 'Date Range',
    type: 'custom',
    customRender: (value, onChange, onKeyPress) => (
        <DateRangePicker
            value={value}
            onChange={onChange}
        />
    ),
}
```

## Backend Requirements

Your backend controller should return data in this format:

```php
return inertia('module/index', [
    'items' => ItemResource::collection($items), // Paginated collection
    'filters' => $request->only(['name', 'category']), // Current filters
    'categories' => $categories, // Filter options
]);
```

## Features

✅ **Reusable** - Use in any module with minimal code
✅ **Type-safe** - Full TypeScript support
✅ **Flexible** - Customize columns, actions, and filters
✅ **Pagination** - Built-in pagination with filter preservation
✅ **Actions** - Conditional row actions
✅ **Custom Rendering** - Full control over cell rendering
✅ **Search** - Manual search button with Enter key support
✅ **Filters** - Text, select, and custom filter types

## Tips

1. **Always preserve filters in pagination** - Pass `searchFilters` to DataTable
2. **Use 'all' for empty select values** - The system converts 'all' to empty string
3. **Custom renders for complex data** - Use the `render` prop in columns
4. **Conditional actions** - Use `show` prop to conditionally display actions
5. **Type safety** - Define your data interface for type checking

