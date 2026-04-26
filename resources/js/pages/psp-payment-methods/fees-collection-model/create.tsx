import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    type FeesCollectionSlice,
    type PspPaymentMethod,
} from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CreditCard, DollarSign, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSP Payment Methods',
        href: '/psp-payment-methods',
    },
    {
        title: 'Fee Slices',
        href: '#',
    },
];

type EditableFeeSlice = {
    id?: number;
    from: string;
    to: string;
    foc_fixed: string;
    fom_fixed: string;
    foc_percentage: string;
    fom_percentage: string;
    foc_psp_cost_fixed: string;
    fom_psp_cost_fixed: string;
    fom_psp_cost_percentage: string;
    foc_psp_cost_percentage: string;
    installment_fom_fixed: string;
    installment_fom_percentage: string;
    installment_foc_fixed: string;
    installment_foc_percentage: string;
    is_default: boolean;
};

interface FeesCollectionModelProps {
    pspPaymentMethod: PspPaymentMethod;
    feeSlices: FeesCollectionSlice[];
}

const createEmptySlice = (isDefault: boolean = false): EditableFeeSlice => ({
    from: '0',
    to: '0',
    foc_fixed: '0',
    fom_fixed: '0',
    foc_percentage: '0',
    fom_percentage: '0',
    foc_psp_cost_fixed: '0',
    fom_psp_cost_fixed: '0',
    fom_psp_cost_percentage: '0',
    foc_psp_cost_percentage: '0',
    installment_fom_fixed: '0',
    installment_fom_percentage: '0',
    installment_foc_fixed: '0',
    installment_foc_percentage: '0',
    is_default: isDefault,
});

const formatDecimalValue = (
    value: string | number | null | undefined,
): string => {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const normalizedValue = String(value);

    if (!normalizedValue.includes('.')) {
        return normalizedValue;
    }

    return normalizedValue.replace(/\.?0+$/, '').replace(/\.$/, '');
};

const toEditableSlice = (slice: FeesCollectionSlice): EditableFeeSlice => ({
    id: slice.id,
    from: formatDecimalValue(slice.from),
    to: formatDecimalValue(slice.to),
    foc_fixed: formatDecimalValue(slice.foc_fixed),
    fom_fixed: formatDecimalValue(slice.fom_fixed),
    foc_percentage: formatDecimalValue(slice.foc_percentage),
    fom_percentage: formatDecimalValue(slice.fom_percentage),
    foc_psp_cost_fixed: formatDecimalValue(slice.foc_psp_cost_fixed),
    fom_psp_cost_fixed: formatDecimalValue(slice.fom_psp_cost_fixed),
    fom_psp_cost_percentage: formatDecimalValue(slice.fom_psp_cost_percentage),
    foc_psp_cost_percentage: formatDecimalValue(slice.foc_psp_cost_percentage),
    installment_fom_fixed: formatDecimalValue(slice.installment_fom_fixed),
    installment_fom_percentage: formatDecimalValue(
        slice.installment_fom_percentage,
    ),
    installment_foc_fixed: formatDecimalValue(slice.installment_foc_fixed),
    installment_foc_percentage: formatDecimalValue(
        slice.installment_foc_percentage,
    ),
    is_default: slice.is_default,
});

const fieldLabelClassName =
    'text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase';

const toIntegerString = (value: string): string => {
    if (value.trim() === '') {
        return '';
    }

    const numericValue = Number.parseInt(value, 10);

    return Number.isNaN(numericValue) ? value : String(numericValue);
};

const synchronizeSliceStarts = (
    slices: EditableFeeSlice[],
): EditableFeeSlice[] =>
    slices.map((slice, index) => {
        if (index === 0) {
            return {
                ...slice,
                from: toIntegerString(slice.from),
                to: toIntegerString(slice.to),
            };
        }

        const previousTo = Number.parseInt(slices[index - 1]?.to ?? '', 10);

        return {
            ...slice,
            from: Number.isNaN(previousTo) ? '' : String(previousTo + 1),
            to: toIntegerString(slice.to),
        };
    });

export default function FeesCollectionModel({
    pspPaymentMethod,
    feeSlices,
}: FeesCollectionModelProps) {
    const initialSlices = feeSlices.length
        ? synchronizeSliceStarts(feeSlices.map(toEditableSlice))
        : [createEmptySlice(true)];

    const { data, setData, post, processing, errors } = useForm<{
        slices: EditableFeeSlice[];
    }>({
        slices: initialSlices,
    });

    const updateSlice = (
        index: number,
        field: keyof EditableFeeSlice,
        value: string | boolean | number | undefined,
    ) => {
        const nextSlices = data.slices.map((slice, sliceIndex) =>
            sliceIndex === index ? { ...slice, [field]: value } : slice,
        );

        setData('slices', synchronizeSliceStarts(nextSlices));
    };

    const addSlice = () => {
        const lastSlice = data.slices[data.slices.length - 1];
        const lastTo = Number.parseInt(lastSlice?.to ?? '', 10);

        setData(
            'slices',
            synchronizeSliceStarts([
                ...data.slices,
                {
                    ...createEmptySlice(false),
                    from: Number.isNaN(lastTo) ? '' : String(lastTo + 1),
                },
            ]),
        );
    };

    const removeSlice = (index: number) => {
        const nextSlices = data.slices.filter(
            (_, sliceIndex) => sliceIndex !== index,
        );

        if (nextSlices.length === 0) {
            setData('slices', [createEmptySlice(true)]);
            return;
        }

        if (!nextSlices.some((slice) => slice.is_default)) {
            nextSlices[0] = {
                ...nextSlices[0],
                is_default: true,
            };
        }

        setData('slices', synchronizeSliceStarts(nextSlices));
    };

    const markAsDefault = (index: number) => {
        setData(
            'slices',
            synchronizeSliceStarts(
                data.slices.map((slice, sliceIndex) => ({
                    ...slice,
                    is_default: sliceIndex === index,
                })),
            ),
        );
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();

        post(`/fees-collection-model/${pspPaymentMethod.id}`, {
            preserveScroll: true,
        });
    };

    const getFieldError = (index: number, field: keyof EditableFeeSlice) =>
        errors[`slices.${index}.${field}`];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Fee Slices: ${pspPaymentMethod.id}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs tracking-[0.24em] text-muted-foreground uppercase">
                            <DollarSign className="h-4 w-4" />
                            Fees Collection Model
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
                                {pspPaymentMethod.payment_method?.logo_url ? (
                                    <img
                                        src={
                                            pspPaymentMethod.payment_method
                                                ?.logo_url
                                        }
                                        alt="payment method logo"
                                    />
                                ) : (
                                    <CreditCard className="h-7 w-7 text-muted-foreground" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight">
                                    {pspPaymentMethod.payment_method
                                        ?.description || 'Payment Method Fees'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {pspPaymentMethod.psp?.name ||
                                        'PSP not configured'}
                                </p>
                                {pspPaymentMethod.merchant && (
                                    <p className="text-sm text-muted-foreground">
                                        {pspPaymentMethod.merchant.en_name}
                                        {pspPaymentMethod.invoice_type
                                            ? ` • ${pspPaymentMethod.invoice_type.description}`
                                            : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-muted/60 bg-muted/30 py-6">
                        <CardHeader>
                            <CardTitle>Configuration Notes</CardTitle>
                            <CardDescription>
                                This screen saves the full fee slice set for the
                                selected PSP payment method.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                Exactly one row must be marked as default. It
                                still behaves like a normal range and is also
                                used as the fallback when no range matches.
                            </p>
                            <p>
                                Ranges are inclusive. If one row ends at `500`,
                                the next row must start at `501`.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6">
                    <form
                        id="fees-collection-form"
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <Card className="overflow-hidden py-6">
                            <CardHeader className="border-b">
                                <CardTitle>Transaction Fee Slices</CardTitle>
                                <CardDescription>
                                    Define fee ranges for this PSP payment
                                    method. Each next row starts at the previous
                                    upper bound plus one.
                                </CardDescription>
                                <InputError message={errors.slices} />
                            </CardHeader>
                            <CardContent className="space-y-6 p-0">
                                <Table className="min-w-[1480px]">
                                    <TableHeader>
                                        <TableHeadRow>
                                            <TableHead className="w-16">
                                                #
                                            </TableHead>
                                            <TableHead>
                                                Transaction Range
                                            </TableHead>
                                            <TableHead>
                                                FOC Components
                                            </TableHead>
                                            <TableHead>
                                                FOM Components
                                            </TableHead>
                                            <TableHead>PSP Costs</TableHead>
                                            <TableHead>Installment</TableHead>
                                            <TableHead className="w-24 text-center">
                                                Def.
                                            </TableHead>
                                            <TableHead className="w-24 text-center">
                                                Del.
                                            </TableHead>
                                        </TableHeadRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.slices.map((slice, index) => (
                                            <TableBodyRow
                                                className={`${slice.is_default && "bg-green-100"}`}
                                                disableHover={true}
                                                key={slice.id ?? `new-${index}`}
                                            >
                                                <TableCell className="align-top text-base font-semibold">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className="grid gap-3">
                                                        <div className="grid gap-2 md:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <div
                                                                    className={
                                                                        fieldLabelClassName
                                                                    }
                                                                >
                                                                    From
                                                                </div>
                                                                <Input
                                                                    type="number"
                                                                    step="1"
                                                                    min="0"
                                                                    value={
                                                                        slice.from
                                                                    }
                                                                    readOnly={
                                                                        index >
                                                                        0
                                                                    }
                                                                    disabled={
                                                                        index >
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        updateSlice(
                                                                            index,
                                                                            'from',
                                                                            event
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <InputError
                                                                    message={getFieldError(
                                                                        index,
                                                                        'from',
                                                                    )}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div
                                                                    className={
                                                                        fieldLabelClassName
                                                                    }
                                                                >
                                                                    To
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="number"
                                                                        step="1"
                                                                        min="0"
                                                                        value={
                                                                            slice.to
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            updateSlice(
                                                                                index,
                                                                                'to',
                                                                                event
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                                <InputError
                                                                    message={getFieldError(
                                                                        index,
                                                                        'to',
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                        <InputError
                                                            message={getFieldError(
                                                                index,
                                                                'id',
                                                            )}
                                                        />
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="grid gap-3">
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                Fixed ($)
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.foc_fixed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'foc_fixed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'foc_fixed',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                Percent (%)
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.foc_percentage
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'foc_percentage',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'foc_percentage',
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="grid gap-3">
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                Fixed ($)
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.fom_fixed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'fom_fixed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'fom_fixed',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                Percent (%)
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.fom_percentage
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'fom_percentage',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'fom_percentage',
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOC Fixed
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.foc_psp_cost_fixed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'foc_psp_cost_fixed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'foc_psp_cost_fixed',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOM Fixed
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.fom_psp_cost_fixed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'fom_psp_cost_fixed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'fom_psp_cost_fixed',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOC %
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.foc_psp_cost_percentage
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'foc_psp_cost_percentage',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'foc_psp_cost_percentage',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOM %
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.fom_psp_cost_percentage
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'fom_psp_cost_percentage',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'fom_psp_cost_percentage',
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOM Fixed
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.installment_fom_fixed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'installment_fom_fixed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'installment_fom_fixed',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOM %
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.installment_fom_percentage
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'installment_fom_percentage',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'installment_fom_percentage',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOC Fixed
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.installment_foc_fixed
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'installment_foc_fixed',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'installment_foc_fixed',
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={
                                                                    fieldLabelClassName
                                                                }
                                                            >
                                                                FOC %
                                                            </div>
                                                            <Input
                                                                type="number"
                                                                step="0.00001"
                                                                min="0"
                                                                value={
                                                                    slice.installment_foc_percentage
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    updateSlice(
                                                                        index,
                                                                        'installment_foc_percentage',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <InputError
                                                                message={getFieldError(
                                                                    index,
                                                                    'installment_foc_percentage',
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center align-top">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            name="default-fee-slice"
                                                            checked={
                                                                slice.is_default
                                                            }
                                                            onChange={() =>
                                                                markAsDefault(
                                                                    index,
                                                                )
                                                            }
                                                            className="h-5 w-5"
                                                        />
                                                        <InputError
                                                            message={getFieldError(
                                                                index,
                                                                'is_default',
                                                            )}
                                                            className="text-center"
                                                        />
                                                    </div>
                                                </TableCell>

                                                <TableCell className="text-center align-top">
                                                    <Button
                                                        className={"cursor-pointer"}
                                                        type="button"
                                                        variant="link"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeSlice(index)
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableBodyRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="flex items-center justify-between px-6 pb-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addSlice}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Range
                                    </Button>

                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Fees'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
