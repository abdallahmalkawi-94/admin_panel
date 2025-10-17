import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Language, type PaginatedResourceCollection } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { type Column, DataTable } from '@/components/data-table';
import { DataFilters, type FilterField } from '@/components/data-filters';
import { useFilters } from '@/hooks/use-filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Languages',
        href: '/languages',
    },
];

interface Filters {
    name?: string;
    code?: string;
    dir?: string;
}

interface IndexProps {
    languages: PaginatedResourceCollection<Language>;
    filters: Filters;
}

export default function Index({ languages, filters }: IndexProps) {
    const {
        filters: searchFilters,
        handleFilterChange,
        handleSearch,
        clearFilters,
        hasActiveFilters,
    } = useFilters<Filters>({
        route: '/languages',
        initialFilters: filters,
        perPage: languages.meta.per_page,
    });

    const handlePerPageChange = (value: string) => {
        router.get(
            '/languages',
            { per_page: value, ...searchFilters },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const columns: Column<Language>[] = [
        {
            key: 'code',
            label: 'Code',
            className: 'font-medium',
            render: (language) => (
                <Link
                    href={`/languages/${language.code}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-mono"
                >
                    {language.code.toUpperCase()}
                </Link>
            ),
        },
        {
            key: 'name',
            label: 'Name',
        },
        {
            key: 'name_native',
            label: 'Native Name',
        },
        {
            key: 'dir',
            label: 'Direction',
            render: (language) => (
                <Badge variant={language.dir === 'ltr' ? 'secondary' : 'info'}>
                    {language.dir === 'ltr' ? 'Left-to-Right' : 'Right-to-Left'}
                </Badge>
            ),
        },
    ];

    const filterFields: FilterField[] = [
        {
            key: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Search by name...',
        },
        {
            key: 'code',
            label: 'Code',
            type: 'text',
            placeholder: 'Search by code...',
        },
        {
            key: 'dir',
            label: 'Direction',
            type: 'select',
            placeholder: 'All directions',
            options: [
                { value: 'all', label: 'All directions' },
                { value: 'ltr', label: 'Left-to-Right (LTR)' },
                { value: 'rtl', label: 'Right-to-Left (RTL)' },
            ],
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Languages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Languages
                        </h1>
                        <p className="text-muted-foreground">
                            View all languages in the system
                        </p>
                    </div>
                </div>

                <DataFilters
                    fields={filterFields}
                    values={searchFilters}
                    onChange={handleFilterChange}
                    onSearch={handleSearch}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                <DataTable
                    title="All Languages"
                    description="A list of all languages including their codes and text direction."
                    data={languages}
                    columns={columns}
                    searchFilters={searchFilters}
                    onPageSizeChange={handlePerPageChange}
                    emptyMessage="No languages found."
                />
            </div>
        </AppLayout>
    );
}

