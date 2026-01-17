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
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Methods',
        href: '/payment-methods',
    },
    {
        title: 'Create a new payment method',
        href: '/payment-methods/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        logo: null as File | null,
        is_one_time_payment: false,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/payment-methods', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new payment method" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create a new payment method
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new payment method to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new payment method
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                    placeholder="Payment method description"
                                    maxLength={100}
                                    aria-invalid={!!errors.description}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Logo */}
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo</Label>
                                <Input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            'logo',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    aria-invalid={!!errors.logo}
                                />
                                {errors.logo && (
                                    <p className="text-sm text-destructive">
                                        {errors.logo}
                                    </p>
                                )}
                            </div>

                            {/* Is One Time Payment */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_one_time_payment"
                                    checked={data.is_one_time_payment}
                                    onCheckedChange={(checked) =>
                                        setData('is_one_time_payment', Boolean(checked))
                                    }
                                />
                                <Label
                                    htmlFor="is_one_time_payment"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    One Time Payment
                                </Label>
                            </div>
                            {errors.is_one_time_payment && (
                                <p className="text-sm text-destructive">
                                    {errors.is_one_time_payment}
                                </p>
                            )}

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
