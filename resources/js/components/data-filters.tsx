import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export type FilterFieldType = 'text' | 'select' | 'custom';

export interface SelectOption {
    value: string;
    label: string;
}

export interface FilterField {
    key: string;
    label: string;
    type: FilterFieldType;
    placeholder?: string;
    options?: SelectOption[];
    customRender?: (
        value: any,
        onChange: (value: any) => void,
        onKeyPress?: (e: React.KeyboardEvent) => void
    ) => ReactNode;
}

interface DataFiltersProps {
    title?: string;
    fields: FilterField[];
    values: Record<string, any>;
    onChange: (key: string, value: any) => void;
    onSearch: () => void;
    onClear: () => void;
    hasActiveFilters: boolean;
    gridCols?: string;
}

export function DataFilters({
    title = 'Search & Filter',
    fields,
    values,
    onChange,
    onSearch,
    onClear,
    hasActiveFilters,
    gridCols = 'md:grid-cols-2 lg:grid-cols-5',
}: DataFiltersProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>{title}</CardTitle>
                    </div>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={onClear}>
                            <X className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className={`grid gap-4 ${gridCols}`}>
                    {fields.map((field) => (
                        <div key={field.key} className="space-y-2">
                            <label className="text-sm font-medium">{field.label}</label>
                            {field.type === 'text' && (
                                <Input
                                    placeholder={field.placeholder}
                                    value={values[field.key] || ''}
                                    onChange={(e) => onChange(field.key, e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                            )}
                            {field.type === 'select' && field.options && (
                                <Select
                                    value={values[field.key] || 'all'}
                                    onValueChange={(value) => onChange(field.key, value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((option) => (
                                            <SelectItem key={`${option.value}-${option.label}`} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            {field.type === 'custom' &&
                                field.customRender &&
                                field.customRender(
                                    values[field.key],
                                    (value) => onChange(field.key, value),
                                    handleKeyPress
                                )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={onSearch}>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

