import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PspPaymentMethod } from '@/types';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Check,
    Copy,
    CreditCard,
    DollarSign,
    Earth,
    Edit,
    Eye,
    IdCard,
    Key,
    Layers,
    Lock,
} from 'lucide-react';
import { useClipboard } from '@/hooks/use-clipboard';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSP Payment Methods',
        href: '/psp-payment-methods',
    },
    {
        title: 'View PSP Payment Method',
        href: '#',
    },
];

interface ShowProps {
    pspPaymentMethod: PspPaymentMethod;
}

export default function Show({ pspPaymentMethod }: ShowProps) {
    const [copiedText, copy] = useClipboard();

    // Extract all key-value pairs from JSON configs
    const extractKeyValuePairs = (
        json: Record<string, unknown> | null | undefined,
    ): Array<{ key: string; value: string }> => {
        if (!json || typeof json !== 'object') {
            return [];
        }
        return Object.entries(json).map(([key, value]) => ({
            key,
            value: String(value || ''),
        }));
    };

    const testConfig = pspPaymentMethod.test_config as
        | Record<string, unknown>
        | null
        | undefined;
    const liveConfig = pspPaymentMethod.config as
        | Record<string, unknown>
        | null
        | undefined;

    const testConfigPairs = extractKeyValuePairs(testConfig);
    const liveConfigPairs = extractKeyValuePairs(liveConfig);
    const hasTestKeys = testConfigPairs.length > 0;
    const hasLiveKeys = liveConfigPairs.length > 0;
    const [activeKeyTab, setActiveKeyTab] = useState<'test' | 'live'>(
        hasTestKeys ? 'test' : 'live',
    );
    const statusBadge = pspPaymentMethod.is_active ? 'success' : 'secondary';
    const checkoutBadge = pspPaymentMethod.shown_in_checkout
        ? 'success'
        : 'secondary';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PSP Payment Method: ${pspPaymentMethod.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
                                <CreditCard className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    PSP Payment Method
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {pspPaymentMethod.payment_method
                                        ?.description || 'Payment Method'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {pspPaymentMethod.psp?.name ||
                                        'PSP not configured'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={statusBadge}>
                                {pspPaymentMethod.is_active
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
                            <Badge variant={checkoutBadge}>
                                {pspPaymentMethod.shown_in_checkout
                                    ? 'Shown in Checkout'
                                    : 'Hidden'}
                            </Badge>
                            <Button variant="outline" asChild>
                                <Link href="/psp-payment-methods">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link
                                    href={`/psp-payment-methods/${pspPaymentMethod.id}/edit`}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Snapshot */}
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Method ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    #{pspPaymentMethod.id}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Priority
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.priority}
                                </p>
                            </div>
                            <Layers className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Subscription Model
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.subscription_model === 1
                                        ? 'Revenue Sharing'
                                        : 'Licence'}
                                </p>
                            </div>
                            <Eye className="h-5 w-5 text-blue-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Checkout
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.shown_in_checkout
                                        ? 'Visible'
                                        : 'Hidden'}
                                </p>
                            </div>
                            <Eye className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    support international payment
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.support_international_payment
                                        ? 'YES'
                                        : 'NO'}
                                </p>
                            </div>
                            <Earth className="h-5 w-5 text-green-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    support tokenization
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.support_tokenization
                                        ? 'YES'
                                        : 'NO'}
                                </p>
                            </div>
                            <Key className="h-5 w-5 text-red-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    refund option
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.refund_option?.description || 'N/A'}
                                </p>
                            </div>
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    payout model
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {pspPaymentMethod.payout_model?.description || 'N/A'}
                                </p>
                            </div>
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Configuration */}
                    <Card className="py-6 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                            <CardDescription>
                                Payment method settings and limits
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                        Fee Rules
                                    </p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <dt className="text-xs text-muted-foreground">
                                                Fees Type
                                            </dt>
                                            <dd className="text-sm font-semibold">
                                                {pspPaymentMethod.fees_type_description}
                                            </dd>
                                        </div>
                                        <div className="space-y-1">
                                            <dt className="text-xs text-muted-foreground">
                                                Post Fees to PSP
                                            </dt>
                                            <dd className="text-sm font-semibold">
                                                <Badge
                                                    variant={
                                                        pspPaymentMethod.post_fees_to_psp
                                                            ? 'success'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {pspPaymentMethod.post_fees_to_psp
                                                        ? 'Enabled'
                                                        : 'Disabled'}
                                                </Badge>
                                            </dd>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border bg-muted/30 p-4">
                                    <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                        Limits
                                    </p>
                                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1">
                                            <dt className="text-xs text-muted-foreground">
                                                Min Amount
                                            </dt>
                                            <dd className="text-sm font-semibold">
                                                {pspPaymentMethod.min_allowed_amount?.toLocaleString()}
                                            </dd>
                                        </div>
                                        <div className="space-y-1">
                                            <dt className="text-xs text-muted-foreground">
                                                Max Amount
                                            </dt>
                                            <dd className="text-sm font-semibold">
                                                {pspPaymentMethod.max_allowed_amount?.toLocaleString()}
                                            </dd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Keys Configuration */}
                    {(hasTestKeys || hasLiveKeys) && (
                        <Card className="py-6 md:col-span-2">
                            <CardHeader>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <CardTitle>API Keys Configuration</CardTitle>
                                        <CardDescription>
                                            Manage credentials for sandbox testing and
                                            production traffic.
                                        </CardDescription>
                                    </div>
                                    {hasTestKeys && hasLiveKeys && (
                                        <div className="flex flex-wrap gap-2 rounded-lg bg-muted/40 p-1 text-foreground">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveKeyTab('test')
                                                }
                                                className={cn(
                                                    'flex flex-1 items-center justify-center rounded-md px-4 py-2 text-xs font-semibold transition-colors',
                                                    activeKeyTab === 'test'
                                                        ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                                                        : 'text-muted-foreground hover:bg-background/70',
                                                )}
                                            >
                                                Test Config
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveKeyTab('live')
                                                }
                                                className={cn(
                                                    'flex items-center justify-center rounded-md px-4 py-2 text-xs font-semibold transition-colors',
                                                    activeKeyTab === 'live'
                                                        ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                                                        : 'text-muted-foreground hover:bg-background/70',
                                                )}
                                            >
                                                Live Config
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {(hasTestKeys &&
                                    (!hasLiveKeys ||
                                        activeKeyTab === 'test')) && (
                                    <div className="rounded-2xl border bg-background">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold">
                                                    Test Credentials
                                                </h4>
                                                <Badge variant="secondary">
                                                    Sandbox
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-6 px-6 py-5">
                                            {testConfigPairs.map((pair) => (
                                                <div
                                                    key={pair.key}
                                                    className="grid gap-3 md:grid-cols-[240px_1fr]"
                                                >
                                                    <div className="space-y-1">
                                                        <Label className="text-sm font-semibold capitalize">
                                                            {pair.key.replace(
                                                                /_/g,
                                                                ' ',
                                                            )}
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3">
                                                        <Input
                                                            type="text"
                                                            value={pair.value}
                                                            readOnly
                                                            className="border-0 bg-transparent font-mono text-xs focus-visible:ring-0"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground"
                                                            onClick={() =>
                                                                copy(pair.value)
                                                            }
                                                        >
                                                            {copiedText ===
                                                            pair.value ? (
                                                                <Check className="h-4 w-4 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t bg-amber-50/60 px-6 py-4 text-sm text-amber-700">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                                    <Lock className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        Security Best Practices
                                                    </p>
                                                    <p className="mt-1 text-xs text-amber-700/90">
                                                        Never share sandbox keys in
                                                        client-side code or public
                                                        repositories.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {(hasLiveKeys &&
                                    (!hasTestKeys ||
                                        activeKeyTab === 'live')) && (
                                    <div className="rounded-2xl border bg-background">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold">
                                                    Production Credentials
                                                </h4>
                                                <Badge className="bg-emerald-500/10 text-emerald-700">
                                                    Production
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="space-y-6 px-6 py-5">
                                            {liveConfigPairs.map((pair) => (
                                                <div
                                                    key={pair.key}
                                                    className="grid gap-3 md:grid-cols-[240px_1fr]"
                                                >
                                                    <div className="space-y-1">
                                                        <Label className="text-sm font-semibold capitalize">
                                                            {pair.key.replace(
                                                                /_/g,
                                                                ' ',
                                                            )}
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3">
                                                        <Input
                                                            type="text"
                                                            value={pair.value}
                                                            readOnly
                                                            className="border-0 bg-transparent font-mono text-xs focus-visible:ring-0"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground"
                                                            onClick={() =>
                                                                copy(pair.value)
                                                            }
                                                        >
                                                            {copiedText ===
                                                            pair.value ? (
                                                                <Check className="h-4 w-4 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t bg-amber-50/60 px-6 py-4 text-sm text-amber-700">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                                    <Lock className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        Security Best Practices
                                                    </p>
                                                    <p className="mt-1 text-xs text-amber-700/90">
                                                        Never expose production keys in
                                                        client-side code or unsecured
                                                        channels.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
