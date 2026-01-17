import AppLayout from '@/layouts/app-layout';
import { type PaymentMethod, type BreadcrumbItem } from '@/types';
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
        title: 'Edit Payment Method',
        href: '#',
    },
];

interface EditProps {
    paymentMethod: PaymentMethod;
}

export default function Edit({ paymentMethod }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        description: paymentMethod.description || '',
        logo: null as File | null,
        is_one_time_payment: paymentMethod.is_one_time_payment || false,
        _method: 'PATCH',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/payment-methods/${paymentMethod.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Payment Method: ${paymentMethod.description}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Payment Method
                        </h1>
                        <p className="text-muted-foreground">
                            Update payment method information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method Information</CardTitle>
                        <CardDescription>
                            Update the details for the payment method
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
                                {paymentMethod.logo_url && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Current logo:
                                        </p>
                                        <img
                                            src={paymentMethod.logo_url}
                                            alt="Current logo"
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    </div>
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
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Payment Method'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
