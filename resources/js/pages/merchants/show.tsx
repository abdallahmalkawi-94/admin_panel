import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Merchant } from '@/types';
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
import { Edit, ArrowLeft, Building2, Globe, Wallet, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Merchants',
        href: '/merchants',
    },
    {
        title: 'View Merchant',
        href: '#',
    },
];

interface ShowProps {
    merchant: Merchant;
}

const PAYOUT_MODELS: { [key: number]: string } = {
    1: 'Manual',
    2: 'Daily',
    3: 'Weekly',
    4: 'Monthly',
    5: 'Annual',
};

const ORDER_TYPES: { [key: number]: string } = {
    1: 'Push',
    2: 'Pull',
};

export default function Show({ merchant }: ShowProps) {
    const [activeTab, setActiveTab] = useState<'financial' | 'notifications' | 'urls'>('financial');
    const statusVariant = (() => {
        const statusLabel = merchant.status?.description?.toLowerCase() || '';
        if (statusLabel.includes('active')) return 'success';
        if (statusLabel.includes('inactive') || statusLabel.includes('disabled')) return 'destructive';
        if (statusLabel.includes('pending')) return 'info';
        return 'outline';
    })();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Merchant: ${merchant.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border bg-background">
                                {merchant.logo_url ? (
                                    <img
                                        src={merchant.logo_url}
                                        alt={merchant.en_name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Building2 className="h-7 w-7 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Merchant Profile
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {merchant.en_name}
                                </h1>
                                <p className="text-muted-foreground">
                                    {merchant.ar_name || 'Arabic name not set'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={merchant.is_live ? 'success' : 'info'}>
                                {merchant.is_live ? 'Live' : 'Test'}
                            </Badge>
                            <Badge variant={statusVariant}>
                                {merchant.status?.description || 'Status pending'}
                            </Badge>
                            <Button variant="outline" asChild>
                                <Link href="/merchants">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/merchants/${merchant.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Product
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {merchant.product?.en_name || '-'}
                                </p>
                            </div>
                            <Building2 className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Country
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {merchant?.settings?.country?.name || '-'}
                                </p>
                            </div>
                            <Globe className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Currency
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {merchant?.settings?.currency?.symbol
                                        ? `${merchant.settings.currency.symbol} ${merchant.settings.currency.name}`
                                        : '-'}
                                </p>
                            </div>
                            <Wallet className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Payout Model
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {merchant.settings
                                        ? PAYOUT_MODELS[merchant.settings.payout_model]
                                        : '-'}
                                </p>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="lg:col-span-2 py-6">
                        <CardHeader>
                            <CardTitle>Merchant Identity</CardTitle>
                            <CardDescription>
                                Core identifiers and registry details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Merchant ID
                                    </dt>
                                    <dd className="text-base font-semibold">
                                        {merchant.id}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Referral ID
                                    </dt>
                                    <dd className="text-base font-semibold">
                                        {merchant.referral_id || '-'}
                                    </dd>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/*Invoice Types*/}
                    <Card className="md:col-span-2 py-6">
                        <CardHeader>
                            <CardTitle>Invoice Types</CardTitle>
                            <CardDescription>
                                Supported invoice types for this merchant
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {merchant.invoice_types && merchant.invoice_types.length > 0 ? (
                                merchant.invoice_types.map((invoice_type) => (
                                    <Badge key={invoice_type.id} variant="info">
                                        {invoice_type.description}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No invoice types assigned</p>
                            )}
                        </CardContent>
                    </Card>

                    {merchant.settings && (
                        <Card className="lg:col-span-2 py-6">
                            <CardHeader>
                                <CardTitle>Operational Settings</CardTitle>
                                <CardDescription>
                                    Financial setup, notifications, and API endpoints.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-wrap gap-2 rounded-lg bg-muted/40 p-1 text-foreground">
                                    {[
                                        { id: 'financial', label: 'Financial Settings' },
                                        { id: 'notifications', label: 'Notification Settings' },
                                        { id: 'urls', label: 'Custom URLs' },
                                    ].map(({ id, label }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setActiveTab(id as typeof activeTab)}
                                            className={cn(
                                                'flex flex-1 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
                                                activeTab === id
                                                    ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                                                    : 'text-muted-foreground hover:bg-background/70',
                                            )}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className="min-h-[300px]">
                                    {activeTab === 'financial' && (
                                        <div className="space-y-4">
                                        <div className={"grid gap-6 md:grid-cols-2"}>
                                            <div className="space-y-2">
                                                <dt className="text-sm font-medium text-muted-foreground">
                                                    Payout Model
                                                </dt>
                                                <dd className="text-sm">
                                                    {PAYOUT_MODELS[
                                                        merchant.settings.payout_model
                                                        ] || '-'}
                                                </dd>
                                            </div>
                                            <div className="space-y-2">
                                                <dt className="text-sm font-medium text-muted-foreground">
                                                    Supported Order Type
                                                </dt>
                                                <dd className="text-sm">
                                                    {ORDER_TYPES[
                                                        merchant.settings
                                                            .supported_order_type
                                                        ] || '-'}
                                                </dd>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Bank
                                            </dt>
                                            <dd className="text-sm">
                                                {merchant.settings.bank?.en_name ||
                                                    '-'}
                                            </dd>
                                        </div>
                                        <div className="grid gap-2">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                IBAN
                                            </dt>
                                            <dd className="text-sm">
                                                {merchant.settings.iban || '-'}
                                            </dd>
                                        </div>
                                        <div className="grid gap-2">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Bank Account Number
                                            </dt>
                                            <dd className="text-sm">
                                                {merchant.settings.bank_account_no ||
                                                    '-'}
                                            </dd>
                                        </div>
                                        </div>
                                    )}

                                    {activeTab === 'notifications' && (
                                        <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                SMS Notifications
                                            </dt>
                                            <dd>
                                                <Badge
                                                    variant={
                                                        merchant.settings
                                                            .is_enable_sms_notification
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {merchant.settings
                                                        .is_enable_sms_notification
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </Badge>
                                            </dd>
                                        </div>
                                        {merchant.settings.is_enable_sms_notification && (
                                            <div className="grid gap-2 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <dt className="text-sm font-medium text-muted-foreground">
                                                        Monthly SMS Limit
                                                    </dt>
                                                    <dd className="text-sm">
                                                        {merchant.settings.monthly_sms} (Used:{' '}
                                                        {merchant.settings
                                                            .monthly_sms_counter}
                                                        )
                                                    </dd>
                                                </div>
                                                <div className="space-y-2">
                                                    <dt className="text-sm font-medium text-muted-foreground">
                                                        Daily SMS Limit
                                                    </dt>
                                                    <dd className="text-sm">
                                                        {merchant.settings.daily_sms} (Used:{' '}
                                                        {merchant.settings.daily_sms_counter}
                                                        )
                                                    </dd>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid gap-2">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Email Notifications
                                            </dt>
                                            <dd>
                                                <Badge
                                                    variant={
                                                        merchant.settings
                                                            .is_enable_email_notification
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {merchant.settings
                                                        .is_enable_email_notification
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </Badge>
                                            </dd>
                                        </div>
                                        <div className="grid gap-2">
                                            <dt className="text-sm font-medium text-muted-foreground">
                                                Auto Redirect
                                            </dt>
                                            <dd>
                                                <Badge
                                                    variant={
                                                        merchant.settings
                                                            .is_enable_auto_redirect
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {merchant.settings
                                                        .is_enable_auto_redirect
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </Badge>
                                            </dd>
                                        </div>
                                        </div>
                                    )}

                                    {activeTab === 'urls' && (
                                        <div className="space-y-4">
                                        {merchant.settings.has_custom_urls &&
                                        merchant.settings.urls_settings ? (
                                            <>
                                                <div className="grid gap-2">
                                                    <dt className="text-sm font-medium text-muted-foreground">
                                                        Callback URL
                                                    </dt>
                                                    <dd className="break-all text-sm">
                                                        {merchant.settings
                                                            .urls_settings
                                                            ?.callback_url || '-'}
                                                    </dd>
                                                </div>
                                                <div className="grid gap-2">
                                                    <dt className="text-sm font-medium text-muted-foreground">
                                                        Webhook URL
                                                    </dt>
                                                    <dd className="break-all text-sm">
                                                        {merchant.settings
                                                            .urls_settings
                                                            ?.webhook_url || '-'}
                                                    </dd>
                                                </div>
                                                <div className="grid gap-2">
                                                    <dt className="text-sm font-medium text-muted-foreground">
                                                        Invoice Inquiry URL
                                                    </dt>
                                                    <dd className="break-all text-sm">
                                                        {merchant.settings
                                                            .urls_settings
                                                            ?.invoice_inquiry_url ||
                                                            '-'}
                                                    </dd>
                                                </div>
                                                <div className="grid gap-2">
                                                    <dt className="text-sm font-medium text-muted-foreground">
                                                        Invoice Creation URL
                                                    </dt>
                                                    <dd className="break-all text-sm">
                                                        {merchant.settings
                                                            .urls_settings
                                                            ?.invoice_creation_url ||
                                                            '-'}
                                                    </dd>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Custom URLs are not enabled for this merchant.
                                            </p>
                                        )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
