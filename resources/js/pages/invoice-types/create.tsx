import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice Types',
        href: '/invoice-types',
    },
    {
        title: 'Create a new invoice type',
        href: '/invoice-types/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        description: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/invoice-types', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new invoice type" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create a new invoice type
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new invoice type to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Type Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new invoice type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Code */}
                            <div className="space-y-2">
                                <Label htmlFor="code">
                                    Code{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="code"
                                    type="text"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value)
                                    }
                                    placeholder="Invoice type code"
                                    aria-invalid={!!errors.code}
                                />
                                {errors.code && (
                                    <p className="text-sm text-destructive">
                                        {errors.code}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="description"
                                    type="text"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Invoice type description"
                                    maxLength={255}
                                    aria-invalid={!!errors.description}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
