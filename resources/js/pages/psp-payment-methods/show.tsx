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
} from 'lucide-react';
import { useClipboard } from '@/hooks/use-clipboard';

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
                            <div className="grid gap-6 space-y-2 md:grid-cols-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Fees Type
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.fees_type}
                                    </dd>
                                </div>
                            </div>

                            <div className="grid gap-6 space-y-2 md:grid-cols-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Priority
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.priority}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Min Amount
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.min_allowed_amount?.toLocaleString()}
                                    </dd>
                                </div>
                            </div>

                            <div className="grid gap-6 space-y-2 md:grid-cols-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Max Amount
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.max_allowed_amount?.toLocaleString()}
                                    </dd>
                                </div>
                            </div>

                            <div className="grid gap-6 space-y-2 md:grid-cols-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Post Fees to PSP
                                    </dt>
                                    <dd className="text-sm">
                                        <span
                                            className={
                                                pspPaymentMethod.post_fees_to_psp
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                            }
                                        >
                                            {pspPaymentMethod.post_fees_to_psp
                                                ? 'Yes'
                                                : 'No'}
                                        </span>
                                    </dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Keys Configuration */}
                    {(testConfigPairs.length > 0 ||
                        liveConfigPairs.length > 0) && (
                        <Card className="py-6 md:col-span-2">
                            <CardHeader>
                                <CardTitle>API Keys</CardTitle>
                                <CardDescription>
                                    Test and live API keys configuration
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                {/* Test API Keys */}
                                {testConfigPairs.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold">
                                            Test API Keys
                                        </Label>

                                        {testConfigPairs.map((pair) => (
                                            <div
                                                key={pair.key}
                                                className="space-y-2"
                                            >
                                                <Label className="text-sm font-normal text-muted-foreground capitalize">
                                                    {pair.key.replace(
                                                        /_/g,
                                                        ' ',
                                                    )}
                                                </Label>
                                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background">
                                                    <Input
                                                        type="text"
                                                        value={pair.value}
                                                        readOnly
                                                        className="border-0 bg-transparent focus-visible:ring-0"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mr-2"
                                                        onClick={() =>
                                                            copy(pair.value)
                                                        }
                                                    >
                                                        {copiedText ===
                                                        pair.value ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Live API Keys */}
                                {liveConfigPairs.length > 0 && (
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold">
                                            Live API Keys
                                        </Label>

                                        {liveConfigPairs.map((pair) => (
                                            <div
                                                key={pair.key}
                                                className="space-y-2"
                                            >
                                                <Label className="text-sm font-normal text-muted-foreground capitalize">
                                                    {pair.key.replace(
                                                        /_/g,
                                                        ' ',
                                                    )}
                                                </Label>
                                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background">
                                                    <Input
                                                        type="text"
                                                        value={pair.value}
                                                        readOnly
                                                        className="border-0 bg-transparent focus-visible:ring-0"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mr-2"
                                                        onClick={() =>
                                                            copy(pair.value)
                                                        }
                                                    >
                                                        {copiedText ===
                                                        pair.value ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps */}
                    {/*<Card>*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Timestamps</CardTitle>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent className="space-y-4">*/}
                    {/*        <div className="grid gap-2">*/}
                    {/*            <dt className="text-sm font-medium text-muted-foreground">*/}
                    {/*                Created At*/}
                    {/*            </dt>*/}
                    {/*            <dd className="text-sm">*/}
                    {/*                {pspPaymentMethod.created_at}*/}
                    {/*            </dd>*/}
                    {/*        </div>*/}
                    {/*        <div className="grid gap-2">*/}
                    {/*            <dt className="text-sm font-medium text-muted-foreground">*/}
                    {/*                Updated At*/}
                    {/*            </dt>*/}
                    {/*            <dd className="text-sm">*/}
                    {/*                {pspPaymentMethod.updated_at}*/}
                    {/*            </dd>*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </div>
            </div>
        </AppLayout>
    );
}
