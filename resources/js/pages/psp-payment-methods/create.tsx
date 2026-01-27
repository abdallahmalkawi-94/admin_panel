import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Save,
    Plus,
    X,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Sparkles,
    CreditCard,
    Layers,
    ShieldCheck,
    Eye,
} from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSP Payment Methods',
        href: '/psp-payment-methods',
    },
    {
        title: 'Create a new PSP Payment Method',
        href: '/psp-payment-methods/create',
    },
];

interface CreateProps {
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

export default function Create({
    psps,
    paymentMethods,
    refundOptions,
    payoutModels,
}: CreateProps) {
    const [step, setStep] = useState(1);
    const [selectedPaymentMethodIds, setSelectedPaymentMethodIds] = useState<number[]>([]);
    const [paymentMethodConfigs, setPaymentMethodConfigs] = useState<Record<number, PaymentMethodConfig>>({});
    const [openCards, setOpenCards] = useState<Record<number, boolean>>({});

    const { data, setData, post, processing, errors, reset } = useForm({
        psp_id: '',
        payment_method_id: [] as number[],
        refund_option_id: '',
        payout_model_id: '',
        support_tokenization: false,
        subscription_model: '1',
        is_active: true,
        shown_in_checkout: true,
        support_international_payment: false,
        post_fees_to_psp: false,
        fees_type: '0',
        priority: '0',
        max_allowed_amount: '0',
        min_allowed_amount: '0',
        config: null as Record<string, unknown> | null,
        test_config: null as Record<string, unknown> | null,
        payment_methods_config: [] as any[],
    });


    // Initialize payment method configs when payment methods are selected
    useEffect(() => {
        const newConfigs: Record<number, PaymentMethodConfig> = {};
        const newOpenCards: Record<number, boolean> = {};
        selectedPaymentMethodIds.forEach((pmId) => {
            if (!paymentMethodConfigs[pmId]) {
                const existingConfig = paymentMethodConfigs[pmId];
                newConfigs[pmId] = existingConfig || {
                    payment_method_id: pmId,
                    refund_option_id: data.refund_option_id || '',
                    payout_model_id: data.payout_model_id || '',
                    support_tokenization: data.support_tokenization || false,
                    subscription_model: data.subscription_model || '1',
                    is_active: data.is_active ?? true,
                    shown_in_checkout: data.shown_in_checkout ?? true,
                    support_international_payment: data.support_international_payment || false,
                    post_fees_to_psp: data.post_fees_to_psp || false,
                    fees_type: data.fees_type || '0',
                    priority: data.priority || '0',
                    max_allowed_amount: data.max_allowed_amount || '0',
                    min_allowed_amount: data.min_allowed_amount || '0',
                    configPairs: [{ key: '', value: '' }],
                    testConfigPairs: [{ key: '', value: '' }],
                };
            } else {
                newConfigs[pmId] = paymentMethodConfigs[pmId];
            }
            // Initialize all cards as open by default
            if (openCards[pmId] === undefined) {
                newOpenCards[pmId] = true;
            } else {
                newOpenCards[pmId] = openCards[pmId];
            }
        });
        setPaymentMethodConfigs(newConfigs);
        setOpenCards(prev => ({ ...prev, ...newOpenCards }));
    }, [selectedPaymentMethodIds]);

    const handlePaymentMethodChange = (paymentMethodIds: number[]) => {
        setSelectedPaymentMethodIds(paymentMethodIds);
        setData('payment_method_id', paymentMethodIds);
    };

    const updatePaymentMethodConfig = (pmId: number, field: keyof PaymentMethodConfig, value: any) => {
        setPaymentMethodConfigs(prev => ({
            ...prev,
            [pmId]: {
                ...prev[pmId],
                [field]: value,
            }
        }));
    };

    // Helper function to sync keys between config and testConfig
    const syncConfigKeys = (configPairs: KeyValuePair[], testConfigPairs: KeyValuePair[], preserveEmpty: boolean = false) => {
        // Get all unique keys (excluding empty keys)
        const configKeys = configPairs.map(p => p.key.trim()).filter(k => k);
        const testKeys = testConfigPairs.map(p => p.key.trim()).filter(k => k);
        const allKeys = Array.from(new Set([...configKeys, ...testKeys]));

        // Create maps for value lookup (use original key for lookup, not trimmed)
        const configValueMap = new Map<string, string>();
        const testValueMap = new Map<string, string>();

        configPairs.forEach(p => {
            const trimmedKey = p.key.trim();
            if (trimmedKey) {
                // If key already exists, prefer the one with a value
                if (!configValueMap.has(trimmedKey) || p.value) {
                    configValueMap.set(trimmedKey, p.value);
                }
            }
        });

        testConfigPairs.forEach(p => {
            const trimmedKey = p.key.trim();
            if (trimmedKey) {
                // If key already exists, prefer the one with a value
                if (!testValueMap.has(trimmedKey) || p.value) {
                    testValueMap.set(trimmedKey, p.value);
                }
            }
        });

        // Build synchronized arrays with same keys
        const syncedConfigPairs: KeyValuePair[] = allKeys.map(key => ({
            key: key,
            value: configValueMap.get(key) || ''
        }));

        const syncedTestConfigPairs: KeyValuePair[] = allKeys.map(key => ({
            key: key,
            value: testValueMap.get(key) || ''
        }));

        // If preserving empty pairs, add only one empty pair at the end if there are no keys
        if (preserveEmpty) {
            // Only add empty pair if there are no keys and we need a place to add new pairs
            if (syncedConfigPairs.length === 0) {
                syncedConfigPairs.push({ key: '', value: '' });
                syncedTestConfigPairs.push({ key: '', value: '' });
            } else {
                // Check if there's already an empty pair being edited
                const hasEmptyInConfig = configPairs.some(p => !p.key.trim() && p === configPairs[configPairs.length - 1]);
                const hasEmptyInTest = testConfigPairs.some(p => !p.key.trim() && p === testConfigPairs[testConfigPairs.length - 1]);

                // Only add one empty pair if both configs have an empty pair at the end
                if (hasEmptyInConfig && hasEmptyInTest) {
                    syncedConfigPairs.push({ key: '', value: '' });
                    syncedTestConfigPairs.push({ key: '', value: '' });
                }
            }
        } else {
            // Add empty pair if no keys exist
            if (syncedConfigPairs.length === 0) {
                syncedConfigPairs.push({ key: '', value: '' });
                syncedTestConfigPairs.push({ key: '', value: '' });
            }
        }

        return { syncedConfigPairs, syncedTestConfigPairs };
    };

    const addConfigPairToBoth = (pmId: number) => {
        const config = paymentMethodConfigs[pmId];
        const newPair = { key: '', value: '' };

        // Directly add pair to both configs without syncing (empty pairs will sync when key is entered)
        setPaymentMethodConfigs(prev => ({
            ...prev,
            [pmId]: {
                ...prev[pmId],
                configPairs: [...config.configPairs, newPair],
                testConfigPairs: [...config.testConfigPairs, newPair],
            }
        }));
    };

    const removeConfigPair = (pmId: number, type: 'config' | 'test', index: number) => {
        const config = paymentMethodConfigs[pmId];
        const pairToRemove = type === 'config' ? config.configPairs[index] : config.testConfigPairs[index];
        const keyToRemove = pairToRemove.key.trim();

        // Remove from both configs if key is not empty (to keep keys in sync)
        if (keyToRemove) {
            const newConfigPairs = config.configPairs.filter(p => p.key.trim() !== keyToRemove);
            const newTestConfigPairs = config.testConfigPairs.filter(p => p.key.trim() !== keyToRemove);

            // Ensure at least one empty pair exists
            if (newConfigPairs.length === 0) {
                newConfigPairs.push({ key: '', value: '' });
            }
            if (newTestConfigPairs.length === 0) {
                newTestConfigPairs.push({ key: '', value: '' });
            }

            setPaymentMethodConfigs(prev => ({
                ...prev,
                [pmId]: {
                    ...prev[pmId],
                    configPairs: newConfigPairs,
                    testConfigPairs: newTestConfigPairs,
                }
            }));
        } else {
            // If removing empty pair, remove from both to keep them in sync
            const newConfigPairs = config.configPairs.filter((_, i) => {
                if (type === 'config') return i !== index;
                return true;
            });
            const newTestConfigPairs = config.testConfigPairs.filter((_, i) => {
                if (type === 'test') return i !== index;
                return true;
            });

            // Ensure at least one empty pair exists
            if (newConfigPairs.length === 0) {
                newConfigPairs.push({ key: '', value: '' });
            }
            if (newTestConfigPairs.length === 0) {
                newTestConfigPairs.push({ key: '', value: '' });
            }

            setPaymentMethodConfigs(prev => ({
                ...prev,
                [pmId]: {
                    ...prev[pmId],
                    configPairs: newConfigPairs,
                    testConfigPairs: newTestConfigPairs,
                }
            }));
        }
    };

    const syncConfigPairsOnBlur = (pmId: number) => {
        const config = paymentMethodConfigs[pmId];
        // Sync keys to remove duplicates and ensure both configs have the same keys
        const { syncedConfigPairs, syncedTestConfigPairs } = syncConfigKeys(config.configPairs, config.testConfigPairs, false);

        setPaymentMethodConfigs(prev => ({
            ...prev,
            [pmId]: {
                ...prev[pmId],
                configPairs: syncedConfigPairs,
                testConfigPairs: syncedTestConfigPairs,
            }
        }));
    };

    const updateConfigPair = (pmId: number, type: 'config' | 'test', index: number, field: 'key' | 'value', value: string) => {
        const config = paymentMethodConfigs[pmId];

        if (field === 'key') {
            // When updating a key, update it in both configs directly without syncing (to avoid duplicates while typing)
            let updatedConfigPairs = [...config.configPairs];
            let updatedTestConfigPairs = [...config.testConfigPairs];
            const oldKey = type === 'config'
                ? updatedConfigPairs[index].key.trim()
                : updatedTestConfigPairs[index].key.trim();

            // Update the key in the current config
            if (type === 'config') {
                updatedConfigPairs[index] = { ...updatedConfigPairs[index], key: value };
            } else {
                updatedTestConfigPairs[index] = { ...updatedTestConfigPairs[index], key: value };
            }

            // Update the corresponding pair in the other config
            // If typing in an empty pair, update the pair at the same index
            if (!oldKey) {
                if (type === 'config' && index < updatedTestConfigPairs.length) {
                    updatedTestConfigPairs[index] = { ...updatedTestConfigPairs[index], key: value };
                } else if (type === 'test' && index < updatedConfigPairs.length) {
                    updatedConfigPairs[index] = { ...updatedConfigPairs[index], key: value };
                }
            } else {
                // Key is being renamed, find and update it in the other config
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

            // Update state directly without syncing (sync will happen on blur)
            setPaymentMethodConfigs(prev => ({
                ...prev,
                [pmId]: {
                    ...prev[pmId],
                    configPairs: updatedConfigPairs,
                    testConfigPairs: updatedTestConfigPairs,
                }
            }));
        } else {
            // When updating a value, only update the specific config
            if (type === 'config') {
                const updated = [...config.configPairs];
                updated[index] = { ...updated[index], value: value };
                setPaymentMethodConfigs(prev => ({
                    ...prev,
                    [pmId]: {
                        ...prev[pmId],
                        configPairs: updated,
                    }
                }));
            } else {
                const updated = [...config.testConfigPairs];
                updated[index] = { ...updated[index], value: value };
                setPaymentMethodConfigs(prev => ({
                    ...prev,
                    [pmId]: {
                        ...prev[pmId],
                        testConfigPairs: updated,
                    }
                }));
            }
        }
    };

    const handleNext = () => {
        if (step === 1) {
            // Validate step 1
            if (!data.psp_id || selectedPaymentMethodIds.length === 0) {
                return;
            }
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Convert payment method configs to the format expected by backend
        const paymentMethodsConfig = selectedPaymentMethodIds.map((pmId) => {
            const config = paymentMethodConfigs[pmId] || {
                payment_method_id: pmId,
                refund_option_id: '',
                payout_model_id: '',
                support_tokenization: false,
                subscription_model: '1',
                is_active: true,
                shown_in_checkout: true,
                support_international_payment: false,
                post_fees_to_psp: false,
                fees_type: '0',
                priority: '0',
                max_allowed_amount: '0',
                min_allowed_amount: '0',
                configPairs: [{ key: '', value: '' }],
                testConfigPairs: [{ key: '', value: '' }],
            };

            // Convert key-value pairs to JSON objects
            const configObj: Record<string, string> = {};
            (config.configPairs || []).forEach((pair) => {
                if (pair.key.trim()) {
                    configObj[pair.key.trim()] = pair.value;
                }
            });

            const testConfigObj: Record<string, string> = {};
            (config.testConfigPairs || []).forEach((pair) => {
                if (pair.key.trim()) {
                    testConfigObj[pair.key.trim()] = pair.value;
                }
            });

            // Handle refund_option_id and payout_model_id conversion
            const refundOptionId = config.refund_option_id && config.refund_option_id !== '' && config.refund_option_id !== null
                ? parseInt(config.refund_option_id.toString())
                : null;

            const payoutModelId = config.payout_model_id && config.payout_model_id !== '' && config.payout_model_id !== null
                ? parseInt(config.payout_model_id.toString())
                : null;

            return {
                payment_method_id: parseInt(pmId.toString()),
                refund_option_id: refundOptionId,
                payout_model_id: payoutModelId,
                support_tokenization: config.support_tokenization || false,
                subscription_model: parseInt(config.subscription_model?.toString() || '1'),
                is_active: config.is_active ?? true,
                shown_in_checkout: config.shown_in_checkout ?? true,
                support_international_payment: config.support_international_payment || false,
                post_fees_to_psp: config.post_fees_to_psp || false,
                fees_type: parseInt(config.fees_type?.toString() || '0'),
                priority: parseInt(config.priority?.toString() || '0'),
                max_allowed_amount: parseInt(config.max_allowed_amount?.toString() || '0'),
                min_allowed_amount: parseInt(config.min_allowed_amount?.toString() || '0'),
                config: Object.keys(configObj).length > 0 ? configObj : null,
                test_config: Object.keys(testConfigObj).length > 0 ? testConfigObj : null,
            };
        });

        // Validate that we have payment methods selected
        if (selectedPaymentMethodIds.length === 0) {
            return;
        }

        // Validate that payment_methods_config is not empty
        if (paymentMethodsConfig.length === 0) {
            return;
        }

        // Only send the required fields, not the top-level config fields
        const formData: any = {
            psp_id: parseInt(data.psp_id),
            payment_method_id: selectedPaymentMethodIds,
            payment_methods_config: paymentMethodsConfig,
        };

        router.visit('/psp-payment-methods', {
            method: 'post',
            data: formData,
            onSuccess: () => {
                reset();
                setSelectedPaymentMethodIds([]);
                setPaymentMethodConfigs({});
                setStep(1);
            },
        });
    };

    const getPaymentMethodName = (pmId: number) => {
        return paymentMethods.find(pm => pm.id === pmId)?.description || `Payment Method ${pmId}`;
    };

    const selectedPsp = psps.find((psp) => psp.id.toString() === data.psp_id);
    const selectedPaymentMethods = paymentMethods.filter((pm) =>
        selectedPaymentMethodIds.includes(pm.id),
    );
    const activeSelectedCount = selectedPaymentMethodIds.filter((pmId) =>
        (paymentMethodConfigs[pmId]?.is_active ?? true),
    ).length;
    const shownSelectedCount = selectedPaymentMethodIds.filter((pmId) =>
        (paymentMethodConfigs[pmId]?.shown_in_checkout ?? true),
    ).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new PSP Payment Method" />
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
                                Create a new PSP Payment Method
                            </h1>
                            <p className="text-muted-foreground">
                                {step === 1
                                    ? 'Select PSP and payment methods to configure.'
                                    : 'Tune activation, limits, and API configuration.'}
                            </p>
                        </div>
                        <Badge variant="secondary">Step {step} of 2</Badge>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
                    <div className="space-y-6">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    1
                                </div>
                                <span className="font-medium">Basic Information</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    2
                                </div>
                                <span className="font-medium">Configuration</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <Card className="py-6">
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Select PSP and Payment Methods
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* PSP */}
                                <div className="space-y-2">
                                    <Label htmlFor="psp_id">
                                        PSP{' '}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.psp_id}
                                        onValueChange={(value) =>
                                            setData('psp_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="psp_id"
                                            aria-invalid={!!errors.psp_id}
                                        >
                                            <SelectValue placeholder="Select a PSP" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {psps.map((psp) => (
                                                <SelectItem
                                                    key={psp.id}
                                                    value={psp.id.toString()}
                                                >
                                                    {psp.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.psp_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.psp_id}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Methods - Multi Select */}
                                <div className="space-y-2">
                                    <Label htmlFor="payment_method_id">
                                        Payment Methods{' '}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <MultiSelect
                                        options={paymentMethods.map((pm) => ({
                                            id: pm.id,
                                            label: pm.description,
                                        }))}
                                        selected={selectedPaymentMethodIds}
                                        onChange={handlePaymentMethodChange}
                                        placeholder="Select payment methods..."
                                        error={!!errors.payment_method_id}
                                    />
                                    {errors.payment_method_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.payment_method_id}
                                        </p>
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!data.psp_id || selectedPaymentMethodIds.length === 0}
                                    >
                                        Next
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 2 && (
                        <>
                            {/* Configuration for each payment method */}
                            {selectedPaymentMethodIds.map((pmId, index) => {
                                const config = paymentMethodConfigs[pmId] || {
                                    payment_method_id: pmId,
                                    refund_option_id: '',
                                    payout_model_id: '',
                                    support_tokenization: false,
                                    subscription_model: '1',
                                    is_active: true,
                                    shown_in_checkout: true,
                                    support_international_payment: false,
                                    post_fees_to_psp: false,
                                    fees_type: '0',
                                    priority: '0',
                                    max_allowed_amount: '0',
                                    min_allowed_amount: '0',
                                    configPairs: [{ key: '', value: '' }],
                                    testConfigPairs: [{ key: '', value: '' }],
                                };

                                const isOpen = openCards[pmId] ?? true;
                                const configIndex = index;
                                const refundOptionError = errors[`payment_methods_config.${configIndex}.refund_option_id`];
                                const payoutModelError = errors[`payment_methods_config.${configIndex}.payout_model_id`];

                                return (
                                    <Collapsible
                                        key={pmId}
                                        open={isOpen}
                                        onOpenChange={(open) =>
                                            setOpenCards((prev) => ({ ...prev, [pmId]: open }))
                                        }
                                    >
                                        <Card className="py-6">
                                            <CardHeader>
                                                <CollapsibleTrigger asChild>
                                                    <div className="flex items-center justify-between cursor-pointer">
                                                        <div className="flex-1">
                                                            <CardTitle>{getPaymentMethodName(pmId)} Configuration</CardTitle>
                                                            <CardDescription>
                                                                Configure settings for {getPaymentMethodName(pmId)}
                                                            </CardDescription>
                                                        </div>
                                                        <ChevronDown
                                                            className={`h-5 w-5 transition-transform duration-200 ${
                                                                isOpen ? 'transform rotate-180' : ''
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
                                                    <Label htmlFor={`refund_option_${pmId}`}>
                                                        Refund Option{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={config.refund_option_id}
                                                        onValueChange={(value) =>
                                                            updatePaymentMethodConfig(pmId, 'refund_option_id', value)
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id={`refund_option_${pmId}`}
                                                            aria-invalid={!!refundOptionError}
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
                                                    {refundOptionError && (
                                                        <p className="text-sm text-destructive">
                                                            {refundOptionError}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`payout_model_${pmId}`}>
                                                        Payout Model{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={config.payout_model_id}
                                                        onValueChange={(value) =>
                                                            updatePaymentMethodConfig(pmId, 'payout_model_id', value)
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id={`payout_model_${pmId}`}
                                                            aria-invalid={!!payoutModelError}
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
                                                    {payoutModelError && (
                                                        <p className="text-sm text-destructive">
                                                            {payoutModelError}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`subscription_model_${pmId}`}>
                                                        Subscription Model{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Select
                                                        value={config.subscription_model}
                                                        onValueChange={(value) =>
                                                            updatePaymentMethodConfig(pmId, 'subscription_model', value)
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id={`subscription_model_${pmId}`}
                                                        >
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
                                                    <Label htmlFor={`priority_${pmId}`}>
                                                        Priority{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`priority_${pmId}`}
                                                        type="number"
                                                        value={config.priority}
                                                        onChange={(e) =>
                                                            updatePaymentMethodConfig(pmId, 'priority', e.target.value)
                                                        }
                                                        min="0"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`min_allowed_amount_${pmId}`}>
                                                        Min Amount{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`min_allowed_amount_${pmId}`}
                                                        type="number"
                                                        value={config.min_allowed_amount}
                                                        onChange={(e) =>
                                                            updatePaymentMethodConfig(pmId, 'min_allowed_amount', e.target.value)
                                                        }
                                                        min="0"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`max_allowed_amount_${pmId}`}>
                                                        Max Amount{' '}
                                                        <span className="text-destructive">*</span>
                                                    </Label>
                                                    <Input
                                                        id={`max_allowed_amount_${pmId}`}
                                                        type="number"
                                                        value={config.max_allowed_amount}
                                                        onChange={(e) =>
                                                            updatePaymentMethodConfig(pmId, 'max_allowed_amount', e.target.value)
                                                        }
                                                        min="0"
                                                    />
                                                </div>
                                            </div>

                                            {/* Switches */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={`support_tokenization_${pmId}`}>
                                                            Support Tokenization
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id={`support_tokenization_${pmId}`}
                                                        checked={config.support_tokenization}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig(pmId, 'support_tokenization', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={`is_active_${pmId}`}>Active</Label>
                                                    </div>
                                                    <Switch
                                                        id={`is_active_${pmId}`}
                                                        checked={config.is_active}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig(pmId, 'is_active', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={`shown_in_checkout_${pmId}`}>
                                                            Shown in Checkout
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id={`shown_in_checkout_${pmId}`}
                                                        checked={config.shown_in_checkout}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig(pmId, 'shown_in_checkout', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={`support_international_payment_${pmId}`}>
                                                            Support International Payment
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id={`support_international_payment_${pmId}`}
                                                        checked={config.support_international_payment}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig(pmId, 'support_international_payment', checked)
                                                        }
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-0.5">
                                                        <Label htmlFor={`post_fees_to_psp_${pmId}`}>
                                                            Post Fees to PSP
                                                        </Label>
                                                    </div>
                                                    <Switch
                                                        id={`post_fees_to_psp_${pmId}`}
                                                        checked={config.post_fees_to_psp}
                                                        onCheckedChange={(checked) =>
                                                            updatePaymentMethodConfig(pmId, 'post_fees_to_psp', checked)
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
                                                        onClick={() => addConfigPairToBoth(pmId)}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Pair
                                                    </Button>
                                                </div>

                                                {/* Production Config */}
                                                <div className="space-y-4">
                                                    <Label>Production Config</Label>
                                                    <div className="space-y-3">
                                                        {config.configPairs.map((pair, pairIndex) => (
                                                            <div
                                                                key={pairIndex}
                                                                className="flex gap-2 items-start"
                                                            >
                                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                                    <Input
                                                                        placeholder="Key"
                                                                        value={pair.key}
                                                                        onChange={(e) =>
                                                                            updateConfigPair(pmId, 'config', pairIndex, 'key', e.target.value)
                                                                        }
                                                                        onBlur={() => syncConfigPairsOnBlur(pmId)}
                                                                    />
                                                                    <Input
                                                                        placeholder="Value"
                                                                        value={pair.value}
                                                                        onChange={(e) =>
                                                                            updateConfigPair(pmId, 'config', pairIndex, 'value', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                {config.configPairs.length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() => removeConfigPair(pmId, 'config', pairIndex)}
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
                                                        {config.testConfigPairs.map((pair, pairIndex) => (
                                                            <div
                                                                key={pairIndex}
                                                                className="flex gap-2 items-start"
                                                            >
                                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                                    <Input
                                                                        placeholder="Key"
                                                                        value={pair.key}
                                                                        onChange={(e) =>
                                                                            updateConfigPair(pmId, 'test', pairIndex, 'key', e.target.value)
                                                                        }
                                                                        onBlur={() => syncConfigPairsOnBlur(pmId)}
                                                                    />
                                                                    <Input
                                                                        placeholder="Value"
                                                                        value={pair.value}
                                                                        onChange={(e) =>
                                                                            updateConfigPair(pmId, 'test', pairIndex, 'value', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                {config.testConfigPairs.length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="icon"
                                                                        onClick={() => removeConfigPair(pmId, 'test', pairIndex)}
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
                                );
                            })}

                            {/* Navigation */}
                            <div className="flex items-center justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creating...' : 'Create'}
                                </Button>
                            </div>
                        </>
                    )}
                        </form>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                        <Card className="border-muted/60 bg-muted/30 py-6">
                            <CardHeader>
                                <CardTitle>Setup Snapshot</CardTitle>
                                <CardDescription>
                                    Track what will be configured.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        PSP
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {selectedPsp?.name || 'No PSP selected'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedPaymentMethods.length
                                            ? `${selectedPaymentMethods.length} payment methods selected`
                                            : 'Select payment methods to configure'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={activeSelectedCount ? 'success' : 'secondary'}>
                                        {activeSelectedCount} active
                                    </Badge>
                                    <Badge variant={shownSelectedCount ? 'success' : 'secondary'}>
                                        {shownSelectedCount} shown in checkout
                                    </Badge>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CreditCard className="h-4 w-4" />
                                        <span>{selectedPaymentMethods.length || 0} selected methods</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Layers className="h-4 w-4" />
                                        <span>{step === 2 ? 'Configuration in progress' : 'Awaiting configuration'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>{activeSelectedCount ? 'Active routing enabled' : 'Activation pending'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Eye className="h-4 w-4" />
                                        <span>{shownSelectedCount ? 'Checkout visibility set' : 'Checkout visibility pending'}</span>
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
