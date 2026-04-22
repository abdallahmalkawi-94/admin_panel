import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Table,
    TableBody,
    TableBodyRow,
    TableCell,
    TableHead,
    TableHeader,
    TableHeadRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    InvoiceType,
    Merchant,
} from '@/types';
import type { FormDataConvertible } from '@inertiajs/core';
import { Head, router, useForm } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Save,
    Sparkles,
} from 'lucide-react';
import { FormEventHandler, ReactElement, useEffect, useState } from 'react';

type SupportedPaymentMethod = {
    id: number;
    psp_id: number;
    payment_method_id: number;
    payment_method?: {
        id: number;
        description: string;
        code: string;
        logo_url?: string | null;
    } | null;
    merchant_id?: number | null;
    invoice_type_id?: number | null;
    refund_option_id: number;
    payout_model_id: number;
    support_tokenization: boolean;
    subscription_model: number;
    is_active: boolean;
    shown_in_checkout: boolean;
    support_international_payment: boolean;
    post_fees_to_psp: boolean;
    fees_type: number;
    fees_type_description?: string;
    priority: number;
    max_allowed_amount: number;
    min_allowed_amount: number;
    config?: Record<string, unknown> | null;
    test_config?: Record<string, unknown> | null;
    name: string;
};

const REFUND_OPTION_LABELS: Record<number, string> = {
    1: 'No Refund',
    2: 'One Time Refund',
    3: 'Multiple Refunds',
};

const formatConfigValue = (value: unknown): string => {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'string') {
        return value;
    }

    return JSON.stringify(value);
};

const getConfigEntries = (
    config?: Record<string, unknown> | null,
): Array<{ key: string; value: string }> => {
    if (!config || Object.keys(config).length === 0) {
        return [];
    }

    return Object.entries(config).map(([key, value]) => ({
        key,
        value: formatConfigValue(value),
    }));
};

const getSupportedPaymentMethodLabel = (
    paymentMethod: SupportedPaymentMethod,
): string => {
    const paymentMethodName =
        paymentMethod.payment_method?.description ||
        `Payment Method #${paymentMethod.payment_method_id}`;

    return `${paymentMethod.name} - ${paymentMethodName}`;
};

interface CreateProps {
    invoiceTypes: InvoiceType[];
    childMerchants: Merchant[];
    supportedPaymentMethods: SupportedPaymentMethod[];
    merchant: Merchant;
}

interface EditableConfigEntry {
    key: string;
    value: string;
}

interface EditablePaymentMethodDraft {
    subscription_model: string;
    min_allowed_amount: string;
    max_allowed_amount: string;
    is_active: boolean;
    post_fees_to_psp: boolean;
    configEntries: EditableConfigEntry[];
    testConfigEntries: EditableConfigEntry[];
}

interface MergedConfigEntry {
    key: string;
    productionValue: string;
    testValue: string;
}

type OriginalPaymentMethodSnapshot = Record<string, FormDataConvertible> & {
    id: number;
    psp_id: number;
    payment_method_id: number;
    payment_method: {
        id: number;
        description: string;
        code: string;
        logo_url: string | null;
    } | null;
    merchant_id: number | null;
    invoice_type_id: number | null;
    refund_option_id: number;
    payout_model_id: number;
    support_tokenization: boolean;
    subscription_model: number;
    is_active: boolean;
    shown_in_checkout: boolean;
    support_international_payment: boolean;
    post_fees_to_psp: boolean;
    fees_type: number;
    priority: number;
    max_allowed_amount: number;
    min_allowed_amount: number;
    config: Record<string, string>;
    test_config: Record<string, string>;
    name: string;
};

const createEditablePaymentMethodDraft = (
    paymentMethod: SupportedPaymentMethod,
): EditablePaymentMethodDraft => ({
    subscription_model: String(paymentMethod.subscription_model),
    min_allowed_amount: String(paymentMethod.min_allowed_amount),
    max_allowed_amount: String(paymentMethod.max_allowed_amount),
    is_active: paymentMethod.is_active,
    post_fees_to_psp: paymentMethod.post_fees_to_psp,
    configEntries: getConfigEntries(paymentMethod.config),
    testConfigEntries: getConfigEntries(paymentMethod.test_config),
});

const mergeConfigEntries = (
    configEntries: EditableConfigEntry[],
    testConfigEntries: EditableConfigEntry[],
): MergedConfigEntry[] => {
    const merged = new Map<string, MergedConfigEntry>();

    configEntries.forEach((entry) => {
        merged.set(entry.key, {
            key: entry.key,
            productionValue: entry.value,
            testValue: '',
        });
    });

    testConfigEntries.forEach((entry) => {
        const existing = merged.get(entry.key);

        if (existing) {
            merged.set(entry.key, {
                ...existing,
                testValue: entry.value,
            });
            return;
        }

        merged.set(entry.key, {
            key: entry.key,
            productionValue: '',
            testValue: entry.value,
        });
    });

    return Array.from(merged.values());
};

const configEntriesToObject = (
    entries: EditableConfigEntry[],
): Record<string, string> =>
    entries.reduce<Record<string, string>>((result, entry) => {
        const key = entry.key.trim();

        if (key) {
            result[key] = entry.value;
        }

        return result;
    }, {});

const normalizeConfigSnapshot = (
    config?: Record<string, unknown> | null,
): Record<string, string> =>
    Object.entries(config ?? {}).reduce<Record<string, string>>(
        (result, [key, value]) => {
            result[key] = formatConfigValue(value);

            return result;
        },
        {},
    );

const buildOriginalPaymentMethodSnapshot = (
    paymentMethod: SupportedPaymentMethod,
): OriginalPaymentMethodSnapshot => ({
    id: paymentMethod.id,
    psp_id: paymentMethod.psp_id,
    payment_method_id: paymentMethod.payment_method_id,
    payment_method: paymentMethod.payment_method
        ? {
              id: paymentMethod.payment_method.id,
              description: paymentMethod.payment_method.description,
              code: paymentMethod.payment_method.code,
              logo_url: paymentMethod.payment_method.logo_url ?? null,
          }
        : null,
    merchant_id: paymentMethod.merchant_id ?? null,
    invoice_type_id: paymentMethod.invoice_type_id ?? null,
    refund_option_id: paymentMethod.refund_option_id,
    payout_model_id: paymentMethod.payout_model_id,
    support_tokenization: paymentMethod.support_tokenization,
    subscription_model: paymentMethod.subscription_model,
    is_active: paymentMethod.is_active,
    shown_in_checkout: paymentMethod.shown_in_checkout,
    support_international_payment: paymentMethod.support_international_payment,
    post_fees_to_psp: paymentMethod.post_fees_to_psp,
    fees_type: paymentMethod.fees_type,
    priority: paymentMethod.priority,
    max_allowed_amount: paymentMethod.max_allowed_amount,
    min_allowed_amount: paymentMethod.min_allowed_amount,
    config: normalizeConfigSnapshot(paymentMethod.config),
    test_config: normalizeConfigSnapshot(paymentMethod.test_config),
    name: paymentMethod.name,
});

const toInteger = (value: string, fallback: number): number => {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return fallback;
    }

    const parsedValue = Number.parseInt(trimmedValue, 10);

    return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

export default function Create({
    invoiceTypes,
    childMerchants,
    supportedPaymentMethods,
    merchant,
}: CreateProps): ReactElement {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Merchants',
            href: '/merchants',
        },
        {
            title: merchant.en_name,
            href: `/merchants/${merchant.id}`,
        },
        {
            title: 'Create a new Payment Method',
            href: '/psp-payment-methods/create',
        },
    ];

    const [step, setStep] = useState(1);
    const [showInvoiceType, setShowInvoiceType] = useState<boolean>(true);
    const [syncWithAll, setSyncWithAll] = useState<boolean>(true);
    const [selectPaymentMethod, setSelectPaymentMethod] = useState<string>('');
    const [editablePaymentMethods, setEditablePaymentMethods] = useState<
        Record<number, EditablePaymentMethodDraft>
    >({});

    const { data, setData, processing, errors } = useForm({
        psp_payment_method_ids: [] as number[],
        invoice_type_ids: [] as number[],
        child_merchant_ids: [] as number[],
    });

    useEffect(() => {
        if (showInvoiceType) {
            setData(
                'invoice_type_ids',
                invoiceTypes.map((type) => type.id),
            );
        } else {
            setData('invoice_type_ids', []);
        }
    }, [invoiceTypes, setData, showInvoiceType]);

    useEffect(() => {
        if (syncWithAll) {
            setData(
                'child_merchant_ids',
                childMerchants.map((type) => type.id),
            );
        } else {
            setData('child_merchant_ids', []);
        }
    }, [childMerchants, setData, syncWithAll]);

    useEffect(() => {
        const selectedMethods = supportedPaymentMethods.filter((method) =>
            data.psp_payment_method_ids.includes(method.id),
        );

        if (selectedMethods.length === 0) {
            if (selectPaymentMethod !== '') {
                setSelectPaymentMethod('');
            }
            return;
        }

        const hasValidSelection = selectedMethods.some(
            (method) => String(method.id) === selectPaymentMethod,
        );

        if (hasValidSelection) {
            return;
        }

        if (step === 2) {
            setSelectPaymentMethod(String(selectedMethods[0].id));
            return;
        }

        if (selectPaymentMethod !== '') {
            setSelectPaymentMethod('');
        }
    }, [
        data.psp_payment_method_ids,
        selectPaymentMethod,
        step,
        supportedPaymentMethods,
    ]);

    useEffect(() => {
        const selectedMethods = supportedPaymentMethods.filter((method) =>
            data.psp_payment_method_ids.includes(method.id),
        );

        setEditablePaymentMethods((prev) => {
            const next: Record<number, EditablePaymentMethodDraft> = {};

            selectedMethods.forEach((method) => {
                next[method.id] =
                    prev[method.id] ?? createEditablePaymentMethodDraft(method);
            });

            return next;
        });
    }, [data.psp_payment_method_ids, supportedPaymentMethods]);

    const handleNext = () => {
        if (step === 1) {
            // Validate step 1
            if (
                data.invoice_type_ids.length === 0 ||
                data.psp_payment_method_ids.length === 0
            ) {
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

    const selectedPaymentMethods = supportedPaymentMethods.filter((method) =>
        data.psp_payment_method_ids.includes(method.id),
    );

    const selectedSupportedPaymentMethod =
        selectedPaymentMethods.find(
            (method) => String(method.id) === selectPaymentMethod,
        ) ||
        selectedPaymentMethods[0] ||
        null;

    const selectedPaymentMethodDraft = selectedSupportedPaymentMethod
        ? (editablePaymentMethods[selectedSupportedPaymentMethod.id] ??
          createEditablePaymentMethodDraft(selectedSupportedPaymentMethod))
        : null;

    const mergedConfigEntries = selectedPaymentMethodDraft
        ? mergeConfigEntries(
              selectedPaymentMethodDraft.configEntries,
              selectedPaymentMethodDraft.testConfigEntries,
          )
        : [];

    const updateEditablePaymentMethodDraft = (
        paymentMethodId: number,
        field: keyof Pick<
            EditablePaymentMethodDraft,
            | 'subscription_model'
            | 'min_allowed_amount'
            | 'max_allowed_amount'
            | 'is_active'
            | 'post_fees_to_psp'
        >,
        value: string | boolean,
    ) => {
        const paymentMethod = supportedPaymentMethods.find(
            (method) => method.id === paymentMethodId,
        );

        if (!paymentMethod) {
            return;
        }

        setEditablePaymentMethods((prev) => ({
            ...prev,
            [paymentMethodId]: {
                ...(prev[paymentMethodId] ??
                    createEditablePaymentMethodDraft(paymentMethod)),
                [field]: value,
            },
        }));
    };

    const updateConfigEntryValue = (
        paymentMethodId: number,
        configType: 'configEntries' | 'testConfigEntries',
        key: string,
        value: string,
    ) => {
        const paymentMethod = supportedPaymentMethods.find(
            (method) => method.id === paymentMethodId,
        );

        if (!paymentMethod) {
            return;
        }

        setEditablePaymentMethods((prev) => {
            const currentDraft =
                prev[paymentMethodId] ??
                createEditablePaymentMethodDraft(paymentMethod);
            const hasEntry = currentDraft[configType].some(
                (entry) => entry.key === key,
            );

            return {
                ...prev,
                [paymentMethodId]: {
                    ...currentDraft,
                    [configType]: hasEntry
                        ? currentDraft[configType].map((entry) =>
                              entry.key === key ? { ...entry, value } : entry,
                          )
                        : [...currentDraft[configType], { key, value }],
                },
            };
        });
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const paymentMethods = selectedPaymentMethods.map((paymentMethod) => {
            const draft =
                editablePaymentMethods[paymentMethod.id] ??
                createEditablePaymentMethodDraft(paymentMethod);

            return {
                source_psp_payment_method_id: paymentMethod.id,
                original: buildOriginalPaymentMethodSnapshot(paymentMethod),
                edited: {
                    subscription_model: toInteger(
                        draft.subscription_model,
                        paymentMethod.subscription_model,
                    ),
                    min_allowed_amount: toInteger(
                        draft.min_allowed_amount,
                        paymentMethod.min_allowed_amount,
                    ),
                    max_allowed_amount: toInteger(
                        draft.max_allowed_amount,
                        paymentMethod.max_allowed_amount,
                    ),
                    is_active: draft.is_active,
                    post_fees_to_psp: draft.post_fees_to_psp,
                    config: configEntriesToObject(draft.configEntries),
                    test_config: configEntriesToObject(
                        draft.testConfigEntries,
                    ),
                },
            };
        });
        console.log("paymentMethod", paymentMethods);
        const formData = {
            invoice_type_ids: data.invoice_type_ids,
            child_merchant_ids: data.child_merchant_ids,
            psp_payment_method_ids: data.psp_payment_method_ids,
            payment_methods: paymentMethods,
        };

        router.visit(`/merchants/${merchant.id}/payment_methods`, {
            method: 'post',
            data: formData,
            onSuccess: () => {
                setStep(1);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new PSP Payment Method" />
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                <Sparkles className="h-4 w-4" />
                                PSP Payment Methods
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                                Create a new payment methods
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground md:text-base">
                                {step === 1
                                    ? 'Select a invoice types & payment methods to configure.'
                                    : 'Review the selected payment method settings and API configuration.'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary">Step {step} of 2</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
                    <div className="space-y-2">
                        <div className="rounded-2xl border border-muted/60 bg-background/70 p-4 shadow-sm">
                            <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                                <span>Step {step} of 2</span>
                                <span>{step === 1 ? 'Select' : 'Review'}</span>
                            </div>
                            <div className="mt-4 grid gap-4 md:grid-cols-2">
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                                        step >= 1
                                            ? 'border-emerald-500/40 bg-emerald-500/5 text-foreground'
                                            : 'border-muted bg-background text-muted-foreground'
                                    }`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                                            step >= 1
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        1
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">
                                            Basic Info
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${
                                        step >= 2
                                            ? 'border-emerald-500/40 bg-emerald-500/5 text-foreground'
                                            : 'border-muted bg-background text-muted-foreground'
                                    }`}
                                >
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                                            step >= 2
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        2
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold">
                                            Configuration
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                                <div
                                    className={`h-full rounded-full bg-emerald-500 transition-all duration-300 ${
                                        step >= 2 ? 'w-full' : 'w-1/2'
                                    }`}
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <Card className="py-6">
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>
                                            Select Invoice types and Payment
                                            Methods
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="space-x-3">
                                                <Checkbox
                                                    id="active_to_all"
                                                    checked={showInvoiceType}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        const isChecked =
                                                            checked === true;
                                                        setShowInvoiceType(
                                                            isChecked,
                                                        );
                                                    }}
                                                    tabIndex={1}
                                                />
                                                <Label htmlFor="active_to_all">
                                                    Activate the same payment
                                                    methods for all invoice
                                                    types
                                                </Label>
                                            </div>

                                            {!showInvoiceType && (
                                                <div>
                                                    <Label htmlFor="invoice_types">
                                                        Invoice Types{' '}
                                                        <span className="text-destructive">
                                                            *
                                                        </span>
                                                    </Label>
                                                    <MultiSelect
                                                        options={invoiceTypes.map(
                                                            (type) => ({
                                                                id: type.id,
                                                                label: type.description,
                                                            }),
                                                        )}
                                                        placeholder="Select invoice types..."
                                                        selected={
                                                            data.invoice_type_ids
                                                        }
                                                        onChange={(values) =>
                                                            setData(
                                                                'invoice_type_ids',
                                                                values,
                                                            )
                                                        }
                                                        error={
                                                            !!errors.invoice_type_ids
                                                        }
                                                    />
                                                    {errors.invoice_type_ids && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors.invoice_type_ids
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="invoice_types">
                                                Payment Methods{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <MultiSelect
                                                options={supportedPaymentMethods.map(
                                                    (method) => ({
                                                        id: method.id,
                                                        label: getSupportedPaymentMethodLabel(
                                                            method,
                                                        ),
                                                    }),
                                                )}
                                                placeholder="Select payment methods..."
                                                selected={
                                                    data.psp_payment_method_ids
                                                }
                                                onChange={(values) =>
                                                    setData(
                                                        'psp_payment_method_ids',
                                                        values,
                                                    )
                                                }
                                                error={
                                                    !!errors.psp_payment_method_ids
                                                }
                                            />
                                            {errors.psp_payment_method_ids && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        errors.psp_payment_method_ids
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="space-x-3">
                                                <Checkbox
                                                    id="sync_with_all"
                                                    checked={syncWithAll}
                                                    onCheckedChange={(
                                                        checked,
                                                    ) => {
                                                        const isChecked =
                                                            checked === true;
                                                        setSyncWithAll(
                                                            isChecked,
                                                        );
                                                    }}
                                                    tabIndex={1}
                                                />
                                                <Label htmlFor="sync_with_all">
                                                    Sync selected payment
                                                    methods with all children
                                                    merchant
                                                </Label>
                                            </div>

                                            {!syncWithAll && (
                                                <div>
                                                    <Label htmlFor="child_merchants">
                                                        Child Merchants{' '}
                                                    </Label>
                                                    <MultiSelect
                                                        options={childMerchants.map(
                                                            (merchant) => ({
                                                                id: merchant.id,
                                                                label: merchant.en_name,
                                                            }),
                                                        )}
                                                        placeholder="Select merchant to sync..."
                                                        selected={
                                                            data.child_merchant_ids
                                                        }
                                                        onChange={(values) =>
                                                            setData(
                                                                'child_merchant_ids',
                                                                values,
                                                            )
                                                        }
                                                        error={
                                                            !!errors.child_merchant_ids
                                                        }
                                                    />
                                                    {errors.child_merchant_ids && (
                                                        <p className="text-sm text-destructive">
                                                            {
                                                                errors.child_merchant_ids
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation */}
                                        <div className="flex items-center justify-end gap-4 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    window.history.back()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleNext}
                                                disabled={
                                                    data.invoice_type_ids
                                                        .length === 0 ||
                                                    data.psp_payment_method_ids
                                                        .length === 0
                                                }
                                            >
                                                Next
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {step === 2 && (
                                <Card className="py-6">
                                    <CardHeader>
                                        <CardTitle>
                                            Payment Method Configuration
                                        </CardTitle>
                                        <CardDescription>
                                            Edit only subscription model,
                                            min/max amounts, status, post fees,
                                            and config values. The rest of the
                                            fields stay read-only.
                                        </CardDescription>
                                        <div className="space-y-2">
                                            <Label>
                                                Select Payment Method
                                            </Label>

                                            <Select
                                                value={
                                                    selectedSupportedPaymentMethod
                                                        ? String(
                                                            selectedSupportedPaymentMethod.id,
                                                        )
                                                        : selectPaymentMethod
                                                }
                                                onValueChange={(value) =>
                                                    setSelectPaymentMethod(value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a payment method" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    {selectedPaymentMethods.map(
                                                        (method) => (
                                                            <SelectItem
                                                                key={method.id}
                                                                value={String(
                                                                    method.id,
                                                                )}
                                                            >
                                                                {getSupportedPaymentMethodLabel(
                                                                    method,
                                                                )}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {selectedSupportedPaymentMethod &&
                                        selectedPaymentMethodDraft ? (
                                            <>
                                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            Refund Option
                                                        </p>
                                                        <p className="mt-2 text-sm font-semibold">
                                                            {REFUND_OPTION_LABELS[
                                                                selectedSupportedPaymentMethod
                                                                    .refund_option_id
                                                            ] ||
                                                                `Option #${selectedSupportedPaymentMethod.refund_option_id}`}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            Subscription Model
                                                        </p>
                                                        <div className="mt-2">
                                                            <Select
                                                                value={
                                                                    selectedPaymentMethodDraft.subscription_model
                                                                }
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    updateEditablePaymentMethodDraft(
                                                                        selectedSupportedPaymentMethod.id,
                                                                        'subscription_model',
                                                                        value,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a subscription model" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="1">
                                                                        Revenue
                                                                        Sharing
                                                                    </SelectItem>
                                                                    <SelectItem value="2">
                                                                        Licence
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            Min Allowed Amount
                                                        </p>
                                                        <Input
                                                            className="mt-2"
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                selectedPaymentMethodDraft.min_allowed_amount
                                                            }
                                                            onChange={(e) =>
                                                                updateEditablePaymentMethodDraft(
                                                                    selectedSupportedPaymentMethod.id,
                                                                    'min_allowed_amount',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            Max Allowed Amount
                                                        </p>
                                                        <Input
                                                            className="mt-2"
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                selectedPaymentMethodDraft.max_allowed_amount
                                                            }
                                                            onChange={(e) =>
                                                                updateEditablePaymentMethodDraft(
                                                                    selectedSupportedPaymentMethod.id,
                                                                    'max_allowed_amount',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            Status
                                                        </p>
                                                        <div className="mt-2 flex items-center justify-between gap-3">
                                                            <span className="text-sm font-semibold">
                                                                {selectedPaymentMethodDraft.is_active
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </span>
                                                            <Switch
                                                                checked={
                                                                    selectedPaymentMethodDraft.is_active
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    updateEditablePaymentMethodDraft(
                                                                        selectedSupportedPaymentMethod.id,
                                                                        'is_active',
                                                                        checked,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            International
                                                            Payment
                                                        </p>
                                                        <Badge
                                                            className="mt-2"
                                                            variant={
                                                                selectedSupportedPaymentMethod.support_international_payment
                                                                    ? 'success'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {selectedSupportedPaymentMethod.support_international_payment
                                                                ? 'Supported'
                                                                : 'Not Supported'}
                                                        </Badge>
                                                    </div>
                                                    <div className="rounded-xl border bg-background/60 p-4">
                                                        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                                            Post Fees To PSP
                                                        </p>
                                                        <div className="mt-2 flex items-center justify-between gap-3">
                                                            <span className="text-sm font-semibold">
                                                                {selectedPaymentMethodDraft.post_fees_to_psp
                                                                    ? 'Enabled'
                                                                    : 'Disabled'}
                                                            </span>
                                                            <Switch
                                                                checked={
                                                                    selectedPaymentMethodDraft.post_fees_to_psp
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    updateEditablePaymentMethodDraft(
                                                                        selectedSupportedPaymentMethod.id,
                                                                        'post_fees_to_psp',
                                                                        checked,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="rounded-2xl border bg-background/60 p-4">
                                                    <div className="mb-4">
                                                        <h3 className="text-sm font-semibold">
                                                            API Config
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Edit production and
                                                            test values for the
                                                            existing keys in one
                                                            table.
                                                        </p>
                                                    </div>

                                                    {mergedConfigEntries.length >
                                                    0 ? (
                                                        <div className="rounded-xl border">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableHeadRow>
                                                                        <TableHead>
                                                                            Key
                                                                        </TableHead>
                                                                        <TableHead>
                                                                            Production
                                                                            Value
                                                                        </TableHead>
                                                                        <TableHead>
                                                                            Test
                                                                            Value
                                                                        </TableHead>
                                                                    </TableHeadRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {mergedConfigEntries.map(
                                                                        (
                                                                            entry,
                                                                        ) => (
                                                                            <TableBodyRow
                                                                                key={
                                                                                    entry.key
                                                                                }
                                                                            >
                                                                                <TableCell className="font-medium">
                                                                                    {
                                                                                        entry.key
                                                                                    }
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Input
                                                                                        value={
                                                                                            entry.productionValue
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            updateConfigEntryValue(
                                                                                                selectedSupportedPaymentMethod.id,
                                                                                                'configEntries',
                                                                                                entry.key,
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    <Input
                                                                                        value={
                                                                                            entry.testValue
                                                                                        }
                                                                                        onChange={(
                                                                                            e,
                                                                                        ) =>
                                                                                            updateConfigEntryValue(
                                                                                                selectedSupportedPaymentMethod.id,
                                                                                                'testConfigEntries',
                                                                                                entry.key,
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </TableCell>
                                                                            </TableBodyRow>
                                                                        ),
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                                                            No production or
                                                            test config is
                                                            defined for this
                                                            payment method.
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                                                Select a payment method to
                                                review its configuration.
                                            </div>
                                        )}

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
                                                onClick={() =>
                                                    window.history.back()
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                <Save className="mr-2 h-4 w-4" />
                                                {processing
                                                    ? 'Creating...'
                                                    : 'Create'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
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
                                    <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                        Merchant
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {merchant.en_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedPaymentMethods.length
                                            ? `${selectedPaymentMethods.length} payment methods selected`
                                            : 'Select payment methods to configure'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={showInvoiceType ? 'success' : 'secondary'}>
                                        Active for all invoice type
                                    </Badge>

                                    <p className="text-sm text-muted-foreground">
                                        {`${data.invoice_type_ids.length} invoice types selected`}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={syncWithAll ? 'success' : 'secondary'}>
                                        Sync with all child merchants
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        {`${data.child_merchant_ids.length} child merchants selected`}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
