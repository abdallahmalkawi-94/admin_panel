import AppLayout from '@/layouts/app-layout';
import { type PaymentNetwork, type BreadcrumbItem } from '@/types';
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
        title: 'Payment Networks',
        href: '/payment-networks',
    },
    {
        title: 'View Payment Network',
        href: '#',
    },
];

interface ShowProps {
    paymentNetwork: PaymentNetwork;
}

export default function Show({ paymentNetwork }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payment Network: ${paymentNetwork.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Payment Network Details
                        </h1>
                        <p className="text-muted-foreground">
                            View payment network information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/payment-networks">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/payment-networks/${paymentNetwork.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Payment Network Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Network Information</CardTitle>
                            <CardDescription>
                                Payment network identity and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="text-sm">{paymentNetwork.id}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Name
                                </dt>
                                <dd className="text-sm">
                                    {paymentNetwork.name}
                                </dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Tags
                                </dt>
                                <dd>
                                    {paymentNetwork.tags &&
                                    paymentNetwork.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {paymentNetwork.tags.map(
                                                (tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                                    >
                                                        {tag}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-muted-foreground">
                                            No tags
                                        </span>
                                    )}
                                </dd>
                            </div>
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
                                    {paymentNetwork.created_at}
                                </dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Updated At
                                </dt>
                                <dd className="text-sm">
                                    {paymentNetwork.updated_at}
                                </dd>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
