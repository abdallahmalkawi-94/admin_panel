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
import { Edit, ArrowLeft } from 'lucide-react';

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
    console.log(merchant);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Merchant: ${merchant.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-end gap-3">
                        {merchant.logo_url && (
                            <div className="lg:grid gap-2 hidden">
                                <dd>
                                    <img
                                        src="https://template.canva.com/EAE1YAgPM_U/1/0/400w-R-Meu_EcnME.jpg"
                                        alt={merchant.en_name}
                                        className="h-20 w-20 rounded object-cover"
                                    />
                                </dd>
                            </div>
                        )}

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Merchant Details
                            </h1>
                            <p className="text-muted-foreground">
                                View merchant information and settings
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
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

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Merchant identity and basic details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Status
                                    </dt>
                                    <dd>
                                        <Badge>
                                            {merchant.status?.description || '-'}
                                        </Badge>
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Environment
                                    </dt>
                                    <dd>
                                        <Badge
                                            variant={
                                                merchant.is_live
                                                    ? 'success'
                                                    : 'info'
                                            }
                                        >
                                            {merchant.is_live ? 'Live' : 'Test'}
                                        </Badge>
                                    </dd>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="text-sm">{merchant.id}</dd>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className={"space-y-2"}>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        English Name
                                    </dt>
                                    <dd className="text-sm">{merchant.en_name}</dd>
                                </div>
                                <div className={"space-y-2"}>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Arabic Name
                                    </dt>
                                    <dd className="text-sm">{merchant.ar_name}</dd>
                                </div>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className={"space-y-2"}>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Commercial Registry Name
                                    </dt>
                                    <dd className="text-sm">
                                        {merchant.commercial_registry_name || '-'}
                                    </dd>
                                </div>
                                <div className={"space-y-2"}>
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Referral ID
                                    </dt>
                                    <dd className="text-sm">{merchant.referral_id}</dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product & Parent Merchant */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Relationships</CardTitle>
                            <CardDescription>
                                Associated product, parent merchant, country & currency
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className={"grid gap-6 md:grid-cols-2"}>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Product
                                    </dt>
                                    <dd className="text-sm">
                                        {merchant.product?.en_name || '-'}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Parent Merchant
                                    </dt>
                                    <dd className="text-sm">
                                        {merchant.parent_merchant?.en_name || '-'}
                                    </dd>
                                </div>
                            </div>
                            <div className={"grid gap-2 md:grid-cols-2"}>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Country
                                    </dt>
                                    <dd className="text-sm">
                                        {merchant?.settings?.country.name}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Currency
                                    </dt>
                                    <dd className="text-sm">
                                        {`${merchant?.settings?.currency.symbol} - ${merchant?.settings?.currency.name}`}
                                    </dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Merchant Settings */}
                    {merchant.settings && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financial Settings</CardTitle>
                                    <CardDescription>
                                        Payout and banking information
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
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
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Notification Settings</CardTitle>
                                    <CardDescription>
                                        SMS and email notification configuration
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
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
                                    {
                                        merchant.settings.is_enable_sms_notification && (
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
                                        )
                                    }
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
                                </CardContent>
                            </Card>

                            {merchant.settings.has_custom_urls &&
                                merchant.settings.urls_settings && (
                                    <Card className="md:col-span-2">
                                        <CardHeader>
                                            <CardTitle>Custom URLs</CardTitle>
                                            <CardDescription>
                                                API endpoints and webhook
                                                configuration
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
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
                                        </CardContent>
                                    </Card>
                                )}
                        </>
                    )}

                     {/*Invoice Types*/}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Invoice Types</CardTitle>
                            <CardDescription>
                                Supported invoice types for this merchant
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {merchant.invoice_types && merchant.invoice_types.length > 0 ? (
                                merchant.invoice_types.map((invoice_type) => (
                                    <Badge key={invoice_type.id} variant="outline">
                                        {invoice_type.description}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No invoice types assigned</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

