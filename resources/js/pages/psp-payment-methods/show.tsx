import AppLayout from '@/layouts/app-layout';
import { type PspPaymentMethod, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, ArrowLeft, Copy, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
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
    const extractKeyValuePairs = (json: Record<string, unknown> | null | undefined): Array<{ key: string; value: string }> => {
        if (!json || typeof json !== 'object') {
            return [];
        }
        return Object.entries(json).map(([key, value]) => ({
            key,
            value: String(value || ''),
        }));
    };

    const testConfig = pspPaymentMethod.test_config as Record<string, unknown> | null | undefined;
    const liveConfig = pspPaymentMethod.config as Record<string, unknown> | null | undefined;

    const testConfigPairs = extractKeyValuePairs(testConfig);
    const liveConfigPairs = extractKeyValuePairs(liveConfig);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`PSP Payment Method: ${pspPaymentMethod.id}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            PSP Payment Method Details
                        </h1>
                        <p className="text-muted-foreground">
                            View PSP payment method information
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/psp-payment-methods">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/psp-payment-methods/${pspPaymentMethod.id}/edit`}>
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
                            PSP Payment Method identity and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    ID
                                </dt>
                                <dd className="text-sm">{pspPaymentMethod.id}</dd>
                            </div>
                            <div className="space-y-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    PSP
                                </dt>
                                <dd className="text-sm">
                                    {pspPaymentMethod.psp?.name || 'N/A'}
                                </dd>
                            </div>
                            <div className="space-y-2">
                                <dt className="text-sm font-medium text-muted-foreground">
                                    Payment Method
                                </dt>
                                <dd className="text-sm">
                                    {pspPaymentMethod.payment_method?.description || 'N/A'}
                                </dd>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Configuration */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                            <CardDescription>
                                Payment method settings and limits
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2 space-y-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Subscription Model
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.subscription_model === 1
                                            ? 'Revenue Sharing'
                                            : 'Licence'}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Fees Type
                                    </dt>
                                    <dd className="text-sm">{pspPaymentMethod.fees_type}</dd>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 space-y-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Priority
                                    </dt>
                                    <dd className="text-sm">{pspPaymentMethod.priority}</dd>
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

                            <div className="grid gap-6 md:grid-cols-2 space-y-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Max Amount
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.max_allowed_amount?.toLocaleString()}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Support Tokenization
                                    </dt>
                                    <dd className="text-sm">
                                    <span
                                        className={
                                            pspPaymentMethod.support_tokenization
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                        }
                                    >
                                        {pspPaymentMethod.support_tokenization
                                            ? 'Yes'
                                            : 'No'}
                                    </span>
                                    </dd>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 space-y-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Active
                                    </dt>
                                    <dd className="text-sm">
                                    <span
                                        className={
                                            pspPaymentMethod.is_active
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                        }
                                    >
                                        {pspPaymentMethod.is_active ? 'Yes' : 'No'}
                                    </span>
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Shown in Checkout
                                    </dt>
                                    <dd className="text-sm">
                                    <span
                                        className={
                                            pspPaymentMethod.shown_in_checkout
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                        }
                                    >
                                        {pspPaymentMethod.shown_in_checkout ? 'Yes' : 'No'}
                                    </span>
                                    </dd>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 space-y-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Support International Payment
                                    </dt>
                                    <dd className="text-sm">
                                    <span
                                        className={
                                            pspPaymentMethod.support_international_payment
                                                ? 'text-green-600'
                                                : 'text-gray-500'
                                        }
                                    >
                                        {pspPaymentMethod.support_international_payment
                                            ? 'Yes'
                                            : 'No'}
                                    </span>
                                    </dd>
                                </div>
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
                                        {pspPaymentMethod.post_fees_to_psp ? 'Yes' : 'No'}
                                    </span>
                                    </dd>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 space-y-2">
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Refund Option
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.refund_option?.description || 'N/A'}
                                    </dd>
                                </div>
                                <div className="space-y-2">
                                    <dt className="text-sm font-medium text-muted-foreground">
                                        Payout Model
                                    </dt>
                                    <dd className="text-sm">
                                        {pspPaymentMethod.payout_model?.description || 'N/A'}
                                    </dd>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API Keys Configuration */}
                    {(testConfigPairs.length > 0 || liveConfigPairs.length > 0) && (
                        <Card className="md:col-span-2">
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
                                        <Label className="text-base font-semibold">Test API Keys</Label>

                                        {testConfigPairs.map((pair) => (
                                            <div key={pair.key} className="space-y-2">
                                                <Label className="text-sm font-normal text-muted-foreground capitalize">
                                                    {pair.key.replace(/_/g, ' ')}
                                                </Label>
                                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background">
                                                    <Input
                                                        type="text"
                                                        value={pair.value}
                                                        readOnly
                                                        className="border-0 focus-visible:ring-0 bg-transparent"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mr-2"
                                                        onClick={() => copy(pair.value)}
                                                    >
                                                        {copiedText === pair.value ? (
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
                                        <Label className="text-base font-semibold">Live API Keys</Label>

                                        {liveConfigPairs.map((pair) => (
                                            <div key={pair.key} className="space-y-2">
                                                <Label className="text-sm font-normal text-muted-foreground capitalize">
                                                    {pair.key.replace(/_/g, ' ')}
                                                </Label>
                                                <div className="flex items-center gap-2 rounded-lg border border-border bg-background">
                                                    <Input
                                                        type="text"
                                                        value={pair.value}
                                                        readOnly
                                                        className="border-0 focus-visible:ring-0 bg-transparent"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="mr-2"
                                                        onClick={() => copy(pair.value)}
                                                    >
                                                        {copiedText === pair.value ? (
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
