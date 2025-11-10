import AppLayout from '@/layouts/app-layout';
import { type Bank, type BreadcrumbItem } from '@/types';
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
        title: 'Banks',
        href: '/banks',
    },
    {
        title: 'View Bank',
        href: '#',
    },
];

interface ShowProps {
    bank: Bank;
}

export default function Show({ bank }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Bank: ${bank.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Bank Details
                        </h1>
                        <p className="text-muted-foreground">
                            View bank information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/banks">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/banks/${bank.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Bank Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bank Information</CardTitle>
                            <CardDescription>
                                Bank identity and details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="text-sm">{bank.id}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    English Name
                                </dt>
                                <dd className="text-sm">{bank.en_name}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Arabic Name
                                </dt>
                                <dd className="text-sm">{bank.ar_name}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    SWIFT Code
                                </dt>
                                <dd className="text-sm">
                                    {bank.swift_code || '-'}
                                </dd>
                            </div>
                            {bank.logo_url && (
                                <div className="grid gap-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Logo
                                    </dt>
                                    <dd>
                                        <img
                                            src={bank.logo_url}
                                            alt={bank.en_name}
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
                                <dd className="text-sm">{bank.created_at}</dd>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Updated At
                                </dt>
                                <dd className="text-sm">{bank.updated_at}</dd>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

