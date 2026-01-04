import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Psp } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSPs',
        href: '/psps',
    },
    {
        title: 'PSP Details',
        href: '#',
    },
];

interface ShowProps {
    psp: Psp;
}

export default function Show({ psp }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PSP: ${psp.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {psp.name}
                        </h1>
                        <p className="text-muted-foreground">
                            PSP details and information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/psps">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to PSPs
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/psps/${psp.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            General details about the PSP
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="mt-1 text-sm">{psp.id}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Code
                                </dt>
                                <dd className="mt-1">
                                    <code className="rounded bg-muted px-2 py-1 text-sm">
                                        {psp.code}
                                    </code>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Country
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.country?.name || '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Settlement Currency
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.settlement_currency
                                        ? `${psp.settlement_currency.name} (${psp.settlement_currency.code})`
                                        : '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Monthly Fees
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.settlement_currency?.symbol} {" "}
                                    {psp.monthly_fees}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Status
                                </dt>
                                <dd className="mt-1">
                                    <Badge variant="info">
                                        {psp.status?.description}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Support Money Splitting
                                </dt>
                                <dd className="mt-1">
                                    <Badge variant={psp.support_money_splitting ? 'success' : 'secondary'}>
                                        {psp.support_money_splitting ? 'Yes' : 'No'}
                                    </Badge>
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Auto Transfer
                                </dt>
                                <dd className="mt-1">
                                    <Badge variant={psp.enable_auto_transfer ? 'success' : 'secondary'}>
                                        {psp.enable_auto_transfer ? 'Enabled' : 'Disabled'}
                                    </Badge>
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>
                            PSP contact details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Contact Person
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.contact_person || '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Contact Email
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.contact_email ? (
                                        <a
                                            href={`mailto:${psp.contact_email}`}
                                            className="text-blue-600 hover:underline"
                                            target="_blank"
                                        >
                                            {psp.contact_email}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Technical Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Technical Details</CardTitle>
                        <CardDescription>
                            API and technical configuration
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Base URL
                                </dt>
                                <dd className="mt-1 text-sm break-all">
                                    {psp.base_url ? (
                                        <a
                                            href={psp.base_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {psp.base_url}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    SDK Version
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.sdk_version || '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Dashboard URL
                                </dt>
                                <dd className="mt-1 text-sm break-all">
                                    {psp.dashboard_url ? (
                                        <a
                                            href={psp.dashboard_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {psp.dashboard_url}
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Attachment
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.attachment ? (
                                        <a
                                            href={`/storage/${psp.attachment}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Download
                                        </a>
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Banking Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Banking Details</CardTitle>
                        <CardDescription>
                            Bank account information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Bank
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.bank?.en_name || '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    SWIFT Code
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.bank?.swift_code || '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Bank Account Number
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.bank_account_number || '-'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    IBAN
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {psp.iban || '-'}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                {/* Notes */}
                {psp.notes && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>
                                Additional information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm">
                                {psp.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Metadata */}
                <Card>
                    <CardHeader>
                        <CardTitle>Metadata</CardTitle>
                        <CardDescription>
                            System information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Created At
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {new Date(psp.created_at).toLocaleString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Updated At
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {new Date(psp.updated_at).toLocaleString()}
                                </dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

