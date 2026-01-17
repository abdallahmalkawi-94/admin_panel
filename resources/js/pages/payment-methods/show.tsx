import AppLayout from '@/layouts/app-layout';
import { type PaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Methods',
        href: '/payment-methods',
    },
    {
        title: 'View Payment Method',
        href: '#',
    },
];

interface ShowProps {
    paymentMethod: PaymentMethod;
}

export default function Show({ paymentMethod }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payment Method: ${paymentMethod.description}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment Method Details
                        </h1>
                        <p className="text-muted-foreground">
                            View payment method information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/payment-methods">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/payment-methods/${paymentMethod.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Payment Method Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method Information</CardTitle>
                            <CardDescription>
                                Payment method identity and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="text-sm">{paymentMethod.id}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Description
                                </dt>
                                <dd className="text-sm">
                                    {paymentMethod.description}
                                </dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Code
                                </dt>
                                <dd className="text-sm">{paymentMethod.code}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    One Time Payment
                                </dt>
                                <dd className="text-sm">
                                    <span
                                        className={
                                            paymentMethod.is_one_time_payment
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                        }
                                    >
                                        {paymentMethod.is_one_time_payment
                                            ? 'Yes'
                                            : 'No'}
                                    </span>
                                </dd>
                            </div>
                            {paymentMethod.logo_url && (
                                <div className="grid gap-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Logo
                                    </dt>
                                    <dd>
                                        <img
                                            src={paymentMethod.logo_url}
                                            alt={paymentMethod.description}
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    </dd>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Timestamps</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </dt>
                                <dd className="text-sm">
                                    {paymentMethod.created_at}
                                </dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Updated At
                                </dt>
                                <dd className="text-sm">
                                    {paymentMethod.updated_at}
                                </dd>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
