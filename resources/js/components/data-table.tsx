import { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/pagination';
import type { PaginatedResourceCollection } from '@/types';

export interface Column<T> {
    key: string;
    label: string;
    className?: string;
    render?: (item: T) => ReactNode;
}

export interface Action<T> {
    label: string;
    href?: (item: T) => string;
    onClick?: (item: T) => void;
    variant?: 'default' | 'ghost' | 'destructive' | 'outline' | 'secondary' | 'link';
    className?: string;
    show?: (item: T) => boolean;
}

interface DataTableProps<T> {
    title: string;
    description?: string;
    data: PaginatedResourceCollection<T>;
    columns: Column<T>[];
    actions?: Action<T>[];
    searchFilters?: Record<string, any>;
    onPageSizeChange?: (size: string) => void;
    emptyMessage?: string;
    headerActions?: ReactNode;
}

export function DataTable<T extends Record<string, any>>({
    title,
    description,
    data,
    columns,
    actions = [],
    searchFilters = {},
    onPageSizeChange,
    emptyMessage = 'No data found.',
    headerActions,
}: DataTableProps<T>) {
    const hasActions = actions.length > 0;
    const totalColumns = columns.length + (hasActions ? 1 : 0);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    <div className="flex items-center gap-2">
                        {onPageSizeChange && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Show:</span>
                                <Select
                                    value={data.meta.per_page.toString()}
                                    onValueChange={onPageSizeChange}
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
                        )}
                        {headerActions}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.key} className={column.className}>
                                    {column.label}
                                </TableHead>
                            ))}
                            {hasActions && (
                                <TableHead className="text-right">Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={totalColumns} className="h-24 text-center">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.data.map((item, index) => (
                                <TableRow key={item.id || index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key} className={column.className}>
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </TableCell>
                                    ))}
                                    {hasActions && (
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {actions
                                                    .filter(
                                                        (action) =>
                                                            !action.show || action.show(item)
                                                    )
                                                    .map((action, actionIndex) => (
                                                        <Button
                                                            key={actionIndex}
                                                            variant={action.variant || 'ghost'}
                                                            size="sm"
                                                            onClick={
                                                                action.onClick
                                                                    ? () => action.onClick!(item)
                                                                    : undefined
                                                            }
                                                            asChild={!!action.href}
                                                            className={action.className}
                                                        >
                                                            {action.href ? (
                                                                <Link href={action.href(item)}>
                                                                    {action.label}
                                                                </Link>
                                                            ) : (
                                                                action.label
                                                            )}
                                                        </Button>
                                                    ))}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {data.meta.links && data.meta.links.length > 0 && (
                    <div className="mt-4">
                        <Pagination
                            links={data.meta.links}
                            preserveQuery={{
                                per_page: data.meta.per_page,
                                ...Object.fromEntries(
                                    Object.entries(searchFilters).filter(([, v]) => v !== '')
                                ),
                            }}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

