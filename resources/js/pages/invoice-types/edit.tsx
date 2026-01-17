import AppLayout from '@/layouts/app-layout';
import { type InvoiceType, type BreadcrumbItem } from '@/types';
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
        title: 'Edit Invoice Type',
        href: '#',
    },
];

interface EditProps {
    invoiceType: InvoiceType;
}

export default function Edit({ invoiceType }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        description: invoiceType.description || '',
        _method: 'PATCH',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/invoice-types/${invoiceType.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice Type: ${invoiceType.description}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Invoice Type
                        </h1>
                        <p className="text-muted-foreground">
                            Update invoice type information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Type Information</CardTitle>
                        <CardDescription>
                            Update the details for the invoice type
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Code */}
                            <div className="space-y-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    value={invoiceType.code}
                                    disabled
                                    className="bg-muted cursor-not-allowed"
                                    placeholder="Invoice type code"
                                />
                                <p className="text-sm text-muted-foreground">
                                    Code cannot be changed after creation
                                </p>
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
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Invoice Type'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
