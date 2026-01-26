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
import {
    ArrowLeft,
    BadgeCheck,
    Banknote,
    DollarSign,
    Edit,
    Globe,
    IdCard,
    Mail,
    Phone,
    Split,
    User,
} from 'lucide-react';

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
    const statusVariant = (() => {
        const statusLabel = psp.status?.description?.toLowerCase() || '';
        if (statusLabel.includes('active')) return 'success';
        if (statusLabel.includes('inactive') || statusLabel.includes('blocked')) return 'destructive';
        if (statusLabel.includes('pending')) return 'info';
        return 'outline';
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PSP: ${psp.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
                                <Banknote className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    PSP Profile
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {psp.name} <code className="rounded bg-muted text-sm">({psp.code})</code>
                                </h1>
                                {/*<p className="text-muted-foreground">{psp.code}</p>*/}
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    {psp.contact_email ?? "Contact email not configured"}
                                </p>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    { psp.contact_person || 'Contact person not configured' }
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={statusVariant}>
                                {psp.status?.description}
                            </Badge>
                            <Button asChild variant="outline">
                                <Link href="/psps">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
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
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Psp ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    #{psp.id}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Country
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {psp.country?.name || '-'}
                                </p>
                            </div>
                            <Globe className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Currency
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {psp.settlement_currency
                                        ? `${psp.settlement_currency.code} (${psp.settlement_currency.symbol})`
                                        : '-'}
                                </p>
                            </div>
                            <Banknote className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    monthly fees
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {psp.settlement_currency?.symbol}{' '}
                                    {psp.monthly_fees}
                                </p>
                            </div>
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Splitting
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {psp.support_money_splitting
                                        ? 'Enabled'
                                        : 'Disabled'}
                                </p>
                            </div>
                            <Split className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Auto Transfer
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {psp.enable_auto_transfer
                                        ? 'Enabled'
                                        : 'Disabled'}
                                </p>
                            </div>
                            <BadgeCheck className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                </div>

                {/* Technical Details */}
                <Card className="py-6">
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
                <Card className="py-6">
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
                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                        <CardDescription>
                            Additional information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm whitespace-pre-wrap">
                            {psp.notes ?? "N/A"}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
