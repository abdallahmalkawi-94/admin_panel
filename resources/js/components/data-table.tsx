import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableBodyRow,
    TableCell,
    TableHead,
    TableHeader,
    TableHeadRow,
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
            <Card className="border-muted/60 bg-muted/10">
                <CardHeader className="border-b bg-muted/40">
                <div className="flex items-center justify-between py-3">
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
                <div className="overflow-hidden rounded-lg border bg-background">
                    <Table>
                        <TableHeader className="bg-muted/60 text-foreground">
                    <TableHeadRow>
                        {columns.map((column) => (
                                <TableHead
                                    key={column.key}
                                    className={cn('text-foreground/70 font-semibold', column.className)}
                                >
                                    {column.label}
                                </TableHead>
                            ))}
                            {hasActions && (
                                <TableHead className="text-right text-foreground/70 font-semibold">
                                    Actions
                                </TableHead>
                            )}
                        </TableHeadRow>
                    </TableHeader>
                    <TableBody>
                        {data.data.length === 0 ? (
                            <TableBodyRow>
                                <TableCell colSpan={totalColumns} className="h-24 text-center">
                                    {emptyMessage}
                                </TableCell>
                            </TableBodyRow>
                        ) : (
                            data.data.map((item, index) => (
                                <TableBodyRow key={item.id || index}>
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
                                </TableBodyRow>
                            ))
                        )}
                    </TableBody>
                    </Table>
                </div>
                {data.meta.links && data.meta.links.length > 0 && (
                    <div className="my-4">
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
