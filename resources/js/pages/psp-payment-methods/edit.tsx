import AppLayout from '@/layouts/app-layout';
import { type PspPaymentMethod, type BreadcrumbItem } from '@/types';
import {
    type PspDropDown,
    type PaymentMethodDropDown,
    type RefundOptionDropDown,
    type PayoutModelDropDown,
} from '@/types/dropdown';
import { Head, useForm, router } from '@inertiajs/react';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Save,
    Plus,
    X,
    ChevronDown,
    Sparkles,
    CreditCard,
    ShieldCheck,
    Eye,
    Layers,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSP Payment Methods',
        href: '/psp-payment-methods',
    },
    {
        title: 'Edit PSP Payment Method',
        href: '#',
    },
];

interface EditProps {
    pspPaymentMethod: PspPaymentMethod;
    psps: PspDropDown[];
    paymentMethods: PaymentMethodDropDown[];
    refundOptions: RefundOptionDropDown[];
    payoutModels: PayoutModelDropDown[];
}

interface KeyValuePair {
    key: string;
    value: string;
}

interface PaymentMethodConfig {
    payment_method_id: number;
    refund_option_id: string;
    payout_model_id: string;
    support_tokenization: boolean;
    subscription_model: string;
    is_active: boolean;
    shown_in_checkout: boolean;
    support_international_payment: boolean;
    post_fees_to_psp: boolean;
    fees_type: string;
    priority: string;
    max_allowed_amount: string;
    min_allowed_amount: string;
    configPairs: KeyValuePair[];
    testConfigPairs: KeyValuePair[];
}

export default function Edit({
    pspPaymentMethod,
    psps,
    paymentMethods,
    refundOptions,
    payoutModels,
}: EditProps) {
    const [isCardOpen, setIsCardOpen] = useState(true);

    // Convert existing JSON configs to key-value pairs
    const jsonToPairs = (json: Record<string, unknown> | null | undefined): KeyValuePair[] => {
        if (!json || typeof json !== 'object') {
            return [{ key: '', value: '' }];
        }
        const pairs = Object.entries(json).map(([key, value]) => ({
            key,
            value: String(value),
        }));
        return pairs.length > 0 ? pairs : [{ key: '', value: '' }];
    };

    const [paymentMethodConfig, setPaymentMethodConfig] = useState<PaymentMethodConfig>({
        payment_method_id: pspPaymentMethod.payment_method_id || 0,
        refund_option_id: pspPaymentMethod.refund_option_id?.toString() || '',
        payout_model_id: pspPaymentMethod.payout_model_id?.toString() || '',
        support_tokenization: pspPaymentMethod.support_tokenization || false,
        subscription_model: pspPaymentMethod.subscription_model?.toString() || '1',
        is_active: pspPaymentMethod.is_active ?? true,
        shown_in_checkout: pspPaymentMethod.shown_in_checkout ?? true,
        support_international_payment: pspPaymentMethod.support_international_payment || false,
        post_fees_to_psp: pspPaymentMethod.post_fees_to_psp || false,
        fees_type: pspPaymentMethod.fees_type?.toString() || '0',
        priority: pspPaymentMethod.priority?.toString() || '0',
        max_allowed_amount: pspPaymentMethod.max_allowed_amount?.toString() || '0',
        min_allowed_amount: pspPaymentMethod.min_allowed_amount?.toString() || '0',
        configPairs: jsonToPairs(pspPaymentMethod.config as Record<string, unknown> | null | undefined),
        testConfigPairs: jsonToPairs(pspPaymentMethod.test_config as Record<string, unknown> | null | undefined),
    });

    const { data, processing, errors } = useForm({
        psp_id: pspPaymentMethod.psp_id?.toString() || '',
        payment_method_id: pspPaymentMethod.payment_method_id?.toString() || '',
    });

    const updatePaymentMethodConfig = (field: keyof PaymentMethodConfig, value: string | number | boolean) => {
        setPaymentMethodConfig(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Helper function to sync keys between config and testConfig
    const syncConfigKeys = (configPairs: KeyValuePair[], testConfigPairs: KeyValuePair[], preserveEmpty: boolean = false) => {
        const configKeys = configPairs.map(p => p.key.trim()).filter(k => k);
        const testKeys = testConfigPairs.map(p => p.key.trim()).filter(k => k);
        const allKeys = Array.from(new Set([...configKeys, ...testKeys]));

        const configValueMap = new Map<string, string>();
        const testValueMap = new Map<string, string>();

        configPairs.forEach(p => {
            const trimmedKey = p.key.trim();
            if (trimmedKey) {
                if (!configValueMap.has(trimmedKey) || p.value) {
                    configValueMap.set(trimmedKey, p.value);
                }
            }
        });

        testConfigPairs.forEach(p => {
            const trimmedKey = p.key.trim();
            if (trimmedKey) {
                if (!testValueMap.has(trimmedKey) || p.value) {
                    testValueMap.set(trimmedKey, p.value);
                }
            }
        });

        const syncedConfigPairs: KeyValuePair[] = allKeys.map(key => ({
            key: key,
            value: configValueMap.get(key) || ''
        }));

        const syncedTestConfigPairs: KeyValuePair[] = allKeys.map(key => ({
            key: key,
            value: testValueMap.get(key) || ''
        }));

        if (preserveEmpty) {
            if (syncedConfigPairs.length === 0) {
                syncedConfigPairs.push({ key: '', value: '' });
                syncedTestConfigPairs.push({ key: '', value: '' });
            } else {
                const hasEmptyInConfig = configPairs.some(p => !p.key.trim() && p === configPairs[configPairs.length - 1]);
                const hasEmptyInTest = testConfigPairs.some(p => !p.key.trim() && p === testConfigPairs[testConfigPairs.length - 1]);

                if (hasEmptyInConfig && hasEmptyInTest) {
                    syncedConfigPairs.push({ key: '', value: '' });
                    syncedTestConfigPairs.push({ key: '', value: '' });
                }
            }
        } else {
            if (syncedConfigPairs.length === 0) {
                syncedConfigPairs.push({ key: '', value: '' });
                syncedTestConfigPairs.push({ key: '', value: '' });
            }
        }

        return { syncedConfigPairs, syncedTestConfigPairs };
    };

    const addConfigPairToBoth = () => {
        const newPair = { key: '', value: '' };
        setPaymentMethodConfig(prev => ({
            ...prev,
            configPairs: [...prev.configPairs, newPair],
            testConfigPairs: [...prev.testConfigPairs, newPair],
        }));
    };

    const removeConfigPair = (type: 'config' | 'test', index: number) => {
        const pairToRemove = type === 'config' ? paymentMethodConfig.configPairs[index] : paymentMethodConfig.testConfigPairs[index];
        const keyToRemove = pairToRemove.key.trim();

        if (keyToRemove) {
            const newConfigPairs = paymentMethodConfig.configPairs.filter(p => p.key.trim() !== keyToRemove);
            const newTestConfigPairs = paymentMethodConfig.testConfigPairs.filter(p => p.key.trim() !== keyToRemove);

            if (newConfigPairs.length === 0) {
                newConfigPairs.push({ key: '', value: '' });
            }
            if (newTestConfigPairs.length === 0) {
                newTestConfigPairs.push({ key: '', value: '' });
            }

            setPaymentMethodConfig(prev => ({
                ...prev,
                configPairs: newConfigPairs,
                testConfigPairs: newTestConfigPairs,
            }));
        } else {
            const newConfigPairs = paymentMethodConfig.configPairs.filter((_, i) => {
                if (type === 'config') return i !== index;
                return true;
            });
            const newTestConfigPairs = paymentMethodConfig.testConfigPairs.filter((_, i) => {
                if (type === 'test') return i !== index;
                return true;
            });

            if (newConfigPairs.length === 0) {
                newConfigPairs.push({ key: '', value: '' });
            }
            if (newTestConfigPairs.length === 0) {
                newTestConfigPairs.push({ key: '', value: '' });
            }

            setPaymentMethodConfig(prev => ({
                ...prev,
                configPairs: newConfigPairs,
                testConfigPairs: newTestConfigPairs,
            }));
        }
    };

    const syncConfigPairsOnBlur = () => {
        const { syncedConfigPairs, syncedTestConfigPairs } = syncConfigKeys(
            paymentMethodConfig.configPairs,
            paymentMethodConfig.testConfigPairs,
            false
        );

        setPaymentMethodConfig(prev => ({
            ...prev,
            configPairs: syncedConfigPairs,
            testConfigPairs: syncedTestConfigPairs,
        }));
    };

    const updateConfigPair = (type: 'config' | 'test', index: number, field: 'key' | 'value', value: string) => {
        if (field === 'key') {
            const updatedConfigPairs = [...paymentMethodConfig.configPairs];
            const updatedTestConfigPairs = [...paymentMethodConfig.testConfigPairs];
            const oldKey = type === 'config'
                ? updatedConfigPairs[index].key.trim()
                : updatedTestConfigPairs[index].key.trim();

            if (type === 'config') {
                updatedConfigPairs[index] = { ...updatedConfigPairs[index], key: value };
            } else {
                updatedTestConfigPairs[index] = { ...updatedTestConfigPairs[index], key: value };
            }

            if (!oldKey) {
                if (type === 'config' && index < updatedTestConfigPairs.length) {
                    updatedTestConfigPairs[index] = { ...updatedTestConfigPairs[index], key: value };
                } else if (type === 'test' && index < updatedConfigPairs.length) {
                    updatedConfigPairs[index] = { ...updatedConfigPairs[index], key: value };
                }
            } else {
                if (type === 'config') {
                    const testIndex = updatedTestConfigPairs.findIndex(p => p.key.trim() === oldKey);
                    if (testIndex >= 0) {
                        updatedTestConfigPairs[testIndex] = { ...updatedTestConfigPairs[testIndex], key: value };
                    }
                } else {
                    const configIndex = updatedConfigPairs.findIndex(p => p.key.trim() === oldKey);
                    if (configIndex >= 0) {
                        updatedConfigPairs[configIndex] = { ...updatedConfigPairs[configIndex], key: value };
                    }
                }
            }

            setPaymentMethodConfig(prev => ({
                ...prev,
                configPairs: updatedConfigPairs,
                testConfigPairs: updatedTestConfigPairs,
            }));
        } else {
            if (type === 'config') {
                const updated = [...paymentMethodConfig.configPairs];
                updated[index] = { ...updated[index], value: value };
                setPaymentMethodConfig(prev => ({
                    ...prev,
                    configPairs: updated,
                }));
            } else {
                const updated = [...paymentMethodConfig.testConfigPairs];
                updated[index] = { ...updated[index], value: value };
                setPaymentMethodConfig(prev => ({
                    ...prev,
                    testConfigPairs: updated,
                }));
            }
        }
    };


    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Convert key-value pairs to JSON objects
        const configObj: Record<string, string> = {};
        paymentMethodConfig.configPairs.forEach((pair) => {
            if (pair.key.trim()) {
                configObj[pair.key.trim()] = pair.value;
            }
        });

        const testConfigObj: Record<string, string> = {};
        paymentMethodConfig.testConfigPairs.forEach((pair) => {
            if (pair.key.trim()) {
                testConfigObj[pair.key.trim()] = pair.value;
            }
        });

        const refundOptionId = paymentMethodConfig.refund_option_id && paymentMethodConfig.refund_option_id !== '' && paymentMethodConfig.refund_option_id !== null
            ? parseInt(paymentMethodConfig.refund_option_id.toString())
            : null;

        const payoutModelId = paymentMethodConfig.payout_model_id && paymentMethodConfig.payout_model_id !== '' && paymentMethodConfig.payout_model_id !== null
            ? parseInt(paymentMethodConfig.payout_model_id.toString())
            : null;

        const formData: Record<string, unknown> = {
            psp_id: parseInt(data.psp_id),
            payment_method_id: parseInt(data.payment_method_id),
            refund_option_id: refundOptionId,
            payout_model_id: payoutModelId,
            support_tokenization: paymentMethodConfig.support_tokenization || false,
            subscription_model: parseInt(paymentMethodConfig.subscription_model?.toString() || '1'),
            is_active: paymentMethodConfig.is_active ?? true,
            shown_in_checkout: paymentMethodConfig.shown_in_checkout ?? true,
            support_international_payment: paymentMethodConfig.support_international_payment || false,
            post_fees_to_psp: paymentMethodConfig.post_fees_to_psp || false,
            fees_type: parseInt(paymentMethodConfig.fees_type?.toString() || '0'),
            priority: parseInt(paymentMethodConfig.priority?.toString() || '0'),
            max_allowed_amount: parseInt(paymentMethodConfig.max_allowed_amount?.toString() || '0'),
            min_allowed_amount: parseInt(paymentMethodConfig.min_allowed_amount?.toString() || '0'),
            config: Object.keys(configObj).length > 0 ? configObj : null,
            test_config: Object.keys(testConfigObj).length > 0 ? testConfigObj : null,
        };

        router.visit(`/psp-payment-methods/${pspPaymentMethod.id}`, {
            method: 'patch',
            data: formData as Record<string, string | number | boolean | null>,
        });
    };

    const getPaymentMethodName = () => {
        return paymentMethods.find(pm => pm.id === paymentMethodConfig.payment_method_id)?.description || `Payment Method ${paymentMethodConfig.payment_method_id}`;
    };

    const statusBadge = paymentMethodConfig.is_active ? 'success' : 'secondary';
    const checkoutBadge = paymentMethodConfig.shown_in_checkout ? 'success' : 'secondary';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit PSP Payment Method: ${pspPaymentMethod.id}`} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Sparkles className="h-4 w-4" />
                                PSP Payment Methods
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Edit PSP Payment Method
                            </h1>
                            <p className="text-muted-foreground">
                                Update activation, limits, and API configuration.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant={statusBadge}>
                                {paymentMethodConfig.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant={checkoutBadge}>
                                {paymentMethodConfig.shown_in_checkout ? 'Shown in Checkout' : 'Hidden'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information (Read-only) */}
                    <Card className="py-6">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                PSP and Payment Method details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>PSP</Label>
                                    <div className="text-sm font-medium">
                                        {psps.find(p => p.id.toString() === data.psp_id)?.name || 'N/A'}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Method</Label>
                                    <div className="text-sm font-medium">
                                        {paymentMethods.find(pm => pm.id.toString() === data.payment_method_id)?.description || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Configuration Card */}
                            <Collapsible
                                open={isCardOpen}
                                onOpenChange={setIsCardOpen}
                            >
                                <Card className="py-6">
                                    <CardHeader>
                                        <CollapsibleTrigger asChild>
                                            <div className="flex items-center justify-between cursor-pointer">
                                                <div className="flex-1">
                                                    <CardTitle>{getPaymentMethodName()} Configuration</CardTitle>
                                                    <CardDescription>
                                                        Configure settings for {getPaymentMethodName()}
                                                    </CardDescription>
                                                </div>
                                                <ChevronDown
                                                    className={`h-5 w-5 transition-transform duration-200 ${
                                                        isCardOpen ? 'transform rotate-180' : ''
                                                    }`}
                                                />
                                            </div>
                                        </CollapsibleTrigger>
                                    </CardHeader>
                                    <CollapsibleContent>
                                        <CardContent className="space-y-6">
                                            {/* Refund Option & Payout Model */}
                                            <div className="grid gap-6 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="refund_option_id">
                                                        Refund Option{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={paymentMethodConfig.refund_option_id}
                                                        onValueChange={(value) =>
                                                            updatePaymentMethodConfig('refund_option_id', value)
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="refund_option_id"
                                                            aria-invalid={!!(errors as Record<string, string>).refund_option_id}
                                                        >
                                                            <SelectValue placeholder="Select a refund option" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {refundOptions.map((ro) => (
                                                                <SelectItem
                                                                    key={ro.id}
                                                                    value={ro.id.toString()}
                                                                >
                                                                    {ro.description}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {(errors as Record<string, string>).refund_option_id && (
                                                        <p className="text-sm text-destructive">
                                                            {(errors as Record<string, string>).refund_option_id}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="payout_model_id">
                                                        Payout Model{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={paymentMethodConfig.payout_model_id}
                                                        onValueChange={(value) =>
                                                            updatePaymentMethodConfig('payout_model_id', value)
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="payout_model_id"
                                                            aria-invalid={!!(errors as Record<string, string>).payout_model_id}
                                                        >
                                                            <SelectValue placeholder="Select a payout model" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {payoutModels.map((pm) => (
                                                                <SelectItem
                                                                    key={pm.id}
                                                                    value={pm.id.toString()}
                                                                >
                                                                    {pm.description}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {(errors as Record<string, string>).payout_model_id && (
                                                        <p className="text-sm text-destructive">
                                                            {(errors as Record<string, string>).payout_model_id}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="subscription_model">
                                                        Subscription Model{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={paymentMethodConfig.subscription_model}
                                                        onValueChange={(value) =>
                                                            updatePaymentMethodConfig('subscription_model', value)
                                                        }
                                                    >
                                                        <SelectTrigger id="subscription_model">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">Revenue Sharing</SelectItem>
                                                            <SelectItem value="2">Licence</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            {/* Priority & Amount Limits */}
                                            <div className="grid gap-6 md:grid-cols-3">
                                                <div className="space-y-2">
                                                    <Label htmlFor="priority">
                                                        Priority{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="priority"
                                                        type="number"
                                                        value={paymentMethodConfig.priority}
                                                        onChange={(e) =>
                                                            updatePaymentMethodConfig('priority', e.target.value)
                                                        }
                                                        min="0"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="min_allowed_amount">
                                                        Min Amount{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="min_allowed_amount"
                                                        type="number"
                                                        value={paymentMethodConfig.min_allowed_amount}
                                                        onChange={(e) =>
                                                            updatePaymentMethodConfig('min_allowed_amount', e.target.value)
                                                        }
                                                        min="0"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="max_allowed_amount">
                                                        Max Amount{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id="max_allowed_amount"
                                                        type="number"
                                                        value={paymentMethodConfig.max_allowed_amount}
                                                        onChange={(e) =>
                                                            updatePaymentMethodConfig('max_allowed_amount', e.target.value)
                                                        }
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Switches */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="support_tokenization">
                                                            Support Tokenization
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id="support_tokenization"
                                                        checked={paymentMethodConfig.support_tokenization}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig('support_tokenization', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="is_active">Active</Label>
                                                    </div>
                                                    <Switch
                                                        id="is_active"
                                                        checked={paymentMethodConfig.is_active}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig('is_active', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="shown_in_checkout">
                                                            Shown in Checkout
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id="shown_in_checkout"
                                                        checked={paymentMethodConfig.shown_in_checkout}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig('shown_in_checkout', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="support_international_payment">
                                                            Support International Payment
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id="support_international_payment"
                                                        checked={paymentMethodConfig.support_international_payment}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig('support_international_payment', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor="post_fees_to_psp">
                                                            Post Fees to PSP
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id="post_fees_to_psp"
                                                        checked={paymentMethodConfig.post_fees_to_psp}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig('post_fees_to_psp', checked)
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* JSON Configuration */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-base font-semibold">Configuration (Production & Test)</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={addConfigPairToBoth}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Pair
                                                    </Button>
                                                </div>

                                                {/* Production Config */}
                                                <div className="space-y-4">
                                                    <Label>Production Config</Label>
                                                    <div className="space-y-3">
                                                        {paymentMethodConfig.configPairs.map((pair, pairIndex) => (
                                                            <div
                                                                key={pairIndex}
                                                                className="flex gap-2 items-start"
                                                            >
                                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                                    <Input
                                                                        placeholder="Key"
                                                                        value={pair.key}
                                                                        onChange={(e) =>
                                                                            updateConfigPair('config', pairIndex, 'key', e.target.value)
                                                                        }
                                                                        onBlur={syncConfigPairsOnBlur}
                                                                    />
                                                                    <Input
                                                                        placeholder="Value"
                                                                        value={pair.value}
                                                                        onChange={(e) =>
                                                                            updateConfigPair('config', pairIndex, 'value', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                {paymentMethodConfig.configPairs.length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() => removeConfigPair('config', pairIndex)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Test Config */}
                                                <div className="space-y-4">
                                                    <Label>Test Config</Label>
                                                    <div className="space-y-3">
                                                        {paymentMethodConfig.testConfigPairs.map((pair, pairIndex) => (
                                                            <div
                                                                key={pairIndex}
                                                                className="flex gap-2 items-start"
                                                            >
                                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                                    <Input
                                                                        placeholder="Key"
                                                                        value={pair.key}
                                                                        onChange={(e) =>
                                                                            updateConfigPair('test', pairIndex, 'key', e.target.value)
                                                                        }
                                                                        onBlur={syncConfigPairsOnBlur}
                                                                    />
                                                                    <Input
                                                                        placeholder="Value"
                                                                        value={pair.value}
                                                                        onChange={(e) =>
                                                                            updateConfigPair('test', pairIndex, 'value', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                {paymentMethodConfig.testConfigPairs.length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() => removeConfigPair('test', pairIndex)}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>

                    {/* Navigation */}
                    <div className="flex items-center justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Updating...' : 'Update'}
                        </Button>
                    </div>
                    </form>

                    <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                        <Card className="border-muted/60 bg-muted/30 py-6">
                            <CardHeader>
                                <CardTitle>Live Summary</CardTitle>
                                <CardDescription>
                                    Current routing configuration snapshot.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        PSP
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {pspPaymentMethod.psp?.name || 'PSP'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {getPaymentMethodName()}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={statusBadge}>
                                        {paymentMethodConfig.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <Badge variant={checkoutBadge}>
                                        {paymentMethodConfig.shown_in_checkout ? 'Checkout On' : 'Checkout Off'}
                                    </Badge>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CreditCard className="h-4 w-4" />
                                        <span>{paymentMethodConfig.subscription_model === '1' ? 'Revenue Sharing' : 'Licence'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Layers className="h-4 w-4" />
                                        <span>Priority {paymentMethodConfig.priority}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>{paymentMethodConfig.support_tokenization ? 'Tokenization enabled' : 'Tokenization off'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                        <span>{paymentMethodConfig.shown_in_checkout ? 'Visible in checkout' : 'Hidden in checkout'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
