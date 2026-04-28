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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    LanguageDropDown,
    MerchantDropDown,
    ProductDropDown,
} from '@/types/dropdown';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    Banknote,
    Calendar,
    CalendarCheck,
    CalendarClock,
    CalendarDaysIcon,
    CalendarIcon,
    Loader2,
    Mail,
    Receipt,
    RotateCcw,
    Save,
    Settings2,
    Sparkles,
    Store,
    User,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

interface InvoiceTypeOption {
    id: number;
    code: string;
    description: string;
}

interface CurrencyOption {
    code: string;
    name?: string | null;
    symbol?: string | null;
}

interface PayerProfileOption {
    id: number;
    full_name: string;
    username: string;
    referral_id?: number | string | null;
    email: string;
    mobile_number: string;
}

interface OneTimePaymentProps {
    products: ProductDropDown[];
    languages: LanguageDropDown[];
}

type BillingFrequency = 'daily' | 'weekly' | 'monthly' | 'annual';

const billingFrequencyOptions: {
    value: BillingFrequency;
    label: string;
    icon: typeof Calendar;
}[] = [
    {
        value: 'daily',
        label: 'Daily',
        icon: CalendarDaysIcon,
    },
    {
        value: 'weekly',
        label: 'Weekly',
        icon: CalendarIcon,
    },
    {
        value: 'monthly',
        label: 'Monthly',
        icon: RotateCcw,
    },
    {
        value: 'annual',
        label: 'Annual',
        icon: CalendarCheck,
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoice Management',
        href: '/invoices/one-time-payment',
    },
    {
        title: 'One-time payment',
        href: '/invoices/one-time-payment',
    },
];

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function OneTimePayment({
    products,
}: OneTimePaymentProps) {
    const languages = [
        {
            code: 'en',
            name: 'English',
        },
        {
            code: 'ar',
            name: 'Arabic',
        }
    ]

    const [merchants, setMerchants] = useState<MerchantDropDown[]>([]);
    const [invoiceTypes, setInvoiceTypes] = useState<InvoiceTypeOption[]>([]);
    const [currency, setCurrency] = useState<CurrencyOption | null>(null);
    const [loadingMerchants, setLoadingMerchants] = useState(false);
    const [loadingMerchantContext, setLoadingMerchantContext] = useState(false);
    const [loadingPayer, setLoadingPayer] = useState(false);
    const [payerStatus, setPayerStatus] = useState<
        'idle' | 'found' | 'not_found'
    >('idle');

    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        merchant_id: '',
        invoice_type_id: '',
        invoice_no: '',
        billing_account: '',
        currency_code: '',
        due_amount: '',
        min_amount: '',
        max_amount: '',
        user_id: '',
        username: '',
        full_name: '',
        user_email: '',
        phone: '',
        language_code: '',
        expiry_date: '',
        allow_partial_payment: false,
        scheduled_payment: false,
        billing_frequency: '',
        due_date: '',
        number_of_repetitions: '',
    });

    const payerProfileFound = payerStatus === 'found';

    useEffect(() => {
        if (!data.product_id) {
            setMerchants([]);
            setInvoiceTypes([]);
            setCurrency(null);
            setData('merchant_id', '');
            setData('invoice_type_id', '');
            setData('currency_code', '');
            return;
        }

        setLoadingMerchants(true);
        setMerchants([]);
        setInvoiceTypes([]);
        setCurrency(null);
        setData('merchant_id', '');
        setData('invoice_type_id', '');
        setData('currency_code', '');

        axios
            .get('/merchants/merchants-by-product', {
                params: { product_id: data.product_id },
            })
            .then((response) => {
                setMerchants(response.data.merchants ?? []);
            })
            .catch(() => {
                setMerchants([]);
            })
            .finally(() => {
                setLoadingMerchants(false);
            });
    }, [data.product_id]);

    useEffect(() => {
        if (!data.merchant_id) {
            setInvoiceTypes([]);
            setCurrency(null);
            setData('invoice_type_id', '');
            setData('currency_code', '');
            return;
        }

        setLoadingMerchantContext(true);
        setInvoiceTypes([]);
        setCurrency(null);
        setData('invoice_type_id', '');
        setData('currency_code', '');

        axios
            .get('/invoices/merchant-context', {
                params: { merchant_id: data.merchant_id },
            })
            .then((response) => {
                const nextCurrency = response.data.currency ?? null;

                setInvoiceTypes(response.data.invoiceTypes ?? []);
                setCurrency(nextCurrency);
                setData('currency_code', nextCurrency?.code ?? '');
            })
            .catch(() => {
                setInvoiceTypes([]);
                setCurrency(null);
                setData('currency_code', '');
            })
            .finally(() => {
                setLoadingMerchantContext(false);
            });
    }, [data.merchant_id]);

    useEffect(() => {
        if (!isValidEmail(data.user_email)) {
            setPayerStatus('idle');
            return;
        }

        const timeout = window.setTimeout(() => {
            setLoadingPayer(true);

            axios
                .get('/invoices/payer-profile-by-email', {
                    params: { email: data.user_email },
                })
                .then((response) => {
                    const payerProfile = response.data
                        .payerProfile as PayerProfileOption | null;

                    if (!payerProfile) {
                        if (payerStatus === 'found') {
                            setData('user_id', '');
                            setData('username', '');
                            setData('full_name', '');
                            setData('phone', '');
                        }
                        setPayerStatus('not_found');
                        return;
                    }

                    setData('full_name', payerProfile.full_name ?? '');
                    setData('username', payerProfile.username ?? '');
                    setData('phone', payerProfile.mobile_number ?? '');

                    if (payerProfile.referral_id) {
                        setData('user_id', payerProfile.referral_id.toString());
                    }

                    setPayerStatus('found');
                })
                .catch(() => {
                    setPayerStatus('not_found');
                })
                .finally(() => {
                    setLoadingPayer(false);
                });
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [data.user_email]);

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        post('/invoices');
    };

    const handleReset = () => {
        reset();
        setMerchants([]);
        setInvoiceTypes([]);
        setCurrency(null);
        setPayerStatus('idle');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="One-time payment" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                <Sparkles className="h-4 w-4" />
                                Invoice Management
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                One-time payment
                            </h1>
                            <p className="text-muted-foreground">
                                Create a single-use invoice for a payer and
                                merchant.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-6">
                            <Card className="py-6">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>
                                            Merchant & Product Info
                                        </CardTitle>
                                        <CardDescription>
                                            Select the product, merchant,
                                            assigned invoice type, and billing
                                            account.
                                        </CardDescription>
                                    </div>
                                    <Store className="h-5 w-5 text-emerald-600" />
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="product_id">
                                                Product{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.product_id}
                                                onValueChange={(value) =>
                                                    setData('product_id', value)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="product_id"
                                                    aria-invalid={
                                                        !!errors.product_id
                                                    }
                                                >
                                                    <SelectValue placeholder="Select product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((product) => (
                                                        <SelectItem
                                                            key={product.id}
                                                            value={product.id.toString()}
                                                        >
                                                            {product.en_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.product_id}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="merchant_id">
                                                Merchant{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.merchant_id}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'merchant_id',
                                                        value,
                                                    )
                                                }
                                                disabled={
                                                    !data.product_id ||
                                                    loadingMerchants ||
                                                    merchants.length === 0
                                                }
                                            >
                                                <SelectTrigger
                                                    id="merchant_id"
                                                    aria-invalid={
                                                        !!errors.merchant_id
                                                    }
                                                >
                                                    <SelectValue
                                                        placeholder={
                                                            loadingMerchants
                                                                ? 'Loading merchants...'
                                                                : 'Select merchant'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {merchants.map(
                                                        (merchant) => (
                                                            <SelectItem
                                                                key={
                                                                    merchant.id
                                                                }
                                                                value={merchant.id.toString()}
                                                            >
                                                                {
                                                                    merchant.en_name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.merchant_id}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="invoice_type_id">
                                                Invoice Type{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.invoice_type_id}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'invoice_type_id',
                                                        value,
                                                    )
                                                }
                                                disabled={
                                                    !data.merchant_id ||
                                                    loadingMerchantContext ||
                                                    invoiceTypes.length === 0
                                                }
                                            >
                                                <SelectTrigger
                                                    id="invoice_type_id"
                                                    aria-invalid={
                                                        !!errors.invoice_type_id
                                                    }
                                                >
                                                    <SelectValue
                                                        placeholder={
                                                            loadingMerchantContext
                                                                ? 'Loading invoice types...'
                                                                : 'Select invoice type'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {invoiceTypes.map(
                                                        (invoiceType) => (
                                                            <SelectItem
                                                                key={
                                                                    invoiceType.id
                                                                }
                                                                value={invoiceType.id.toString()}
                                                            >
                                                                {
                                                                    invoiceType.description
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.invoice_type_id}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="invoice_no">
                                                Invoice No.{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="invoice_no"
                                                value={data.invoice_no}
                                                onChange={(event) =>
                                                    setData(
                                                        'invoice_no',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="e.g. INV-2026-001"
                                                aria-invalid={
                                                    !!errors.invoice_no
                                                }
                                            />
                                            <InputError
                                                message={errors.invoice_no}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="language_code">
                                                Language{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Select
                                                value={data.language_code}
                                                onValueChange={(value) =>
                                                    setData(
                                                        'language_code',
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="language_code"
                                                    aria-invalid={
                                                        !!errors.language_code
                                                    }
                                                >
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map(
                                                        (language) => (
                                                            <SelectItem
                                                                key={
                                                                    language.code
                                                                }
                                                                value={
                                                                    language.code
                                                                }
                                                            >
                                                                {language.name}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.language_code}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="expiry_date">
                                                Expiry Date
                                            </Label>
                                            <Input
                                                id="expiry_date"
                                                type="date"
                                                value={data.expiry_date}
                                                onChange={(event) =>
                                                    setData(
                                                        'expiry_date',
                                                        event.target.value,
                                                    )
                                                }
                                                aria-invalid={
                                                    !!errors.expiry_date
                                                }
                                            />
                                            <InputError
                                                message={errors.expiry_date}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="py-6">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>User Information</CardTitle>
                                        <CardDescription>
                                            Enter payer email first to load
                                            existing profile data when
                                            available.
                                        </CardDescription>
                                    </div>
                                    <User className="h-5 w-5 text-blue-600" />
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="user_email">
                                                User Email{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="user_email"
                                                    type="email"
                                                    value={data.user_email}
                                                    onChange={(event) =>
                                                        setData(
                                                            'user_email',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="customer@example.com"
                                                    aria-invalid={
                                                        !!errors.user_email
                                                    }
                                                    className="pr-10"
                                                />
                                                {loadingPayer ? (
                                                    <Loader2 className="absolute top-2.5 right-3 h-4 w-4 animate-spin text-muted-foreground" />
                                                ) : (
                                                    <Mail className="absolute top-2.5 right-3 h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <InputError
                                                message={errors.user_email}
                                            />
                                            {payerStatus === 'not_found' && (
                                                <p className="text-xs font-bold text-red-500">
                                                    No payer profile found.
                                                    Enter payer details
                                                    manually.
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="user_id">
                                                User ID{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="user_id"
                                                value={data.user_id}
                                                readOnly={payerProfileFound}
                                                onChange={(event) =>
                                                    setData(
                                                        'user_id',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Internal CRM ID"
                                                aria-invalid={!!errors.user_id}
                                            />
                                            <InputError
                                                message={errors.user_id}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">
                                                User Name{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="username"
                                                value={data.username}
                                                readOnly={payerProfileFound}
                                                onChange={(event) =>
                                                    setData(
                                                        'username',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Username"
                                                aria-invalid={!!errors.username}
                                            />
                                            <InputError
                                                message={errors.username}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="full_name">
                                                Full Name{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="full_name"
                                                value={data.full_name}
                                                readOnly={payerProfileFound}
                                                onChange={(event) =>
                                                    setData(
                                                        'full_name',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Customer's legal name"
                                                aria-invalid={
                                                    !!errors.full_name
                                                }
                                            />
                                            <InputError
                                                message={errors.full_name}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                User Phone{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={data.phone}
                                                readOnly={payerProfileFound}
                                                onChange={(event) =>
                                                    setData(
                                                        'phone',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="+1 (555) 000-0000"
                                                aria-invalid={!!errors.phone}
                                            />
                                            <InputError
                                                message={errors.phone}
                                            />
                                        </div>

                                        <div
                                            className="space-y-2"
                                            title={
                                                'The user number (national no, iqama no, etc) that the invoice will be attached to'
                                            }
                                        >
                                            <Label htmlFor="billing_account">
                                                Billing Account{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="billing_account"
                                                value={data.billing_account}
                                                onChange={(event) =>
                                                    setData(
                                                        'billing_account',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Main Operating Account"
                                                aria-invalid={
                                                    !!errors.billing_account
                                                }
                                            />
                                            <InputError
                                                message={errors.billing_account}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-slate-800 bg-slate-950 py-6 text-slate-50">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>Billing Details</CardTitle>
                                        <CardDescription className="text-slate-400">
                                            Merchant currency is fixed by
                                            configuration.
                                        </CardDescription>
                                    </div>
                                    <Receipt className="h-5 w-5 text-slate-300" />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="currency_code"
                                            className="text-slate-300"
                                        >
                                            Currency
                                        </Label>
                                        <Input
                                            id="currency_code"
                                            value={
                                                currency
                                                    ? `${currency.code}${currency.name ? ` - ${currency.name}` : ''}`
                                                    : ''
                                            }
                                            readOnly
                                            placeholder="Select merchant first"
                                            className="border-slate-700 bg-slate-900 text-slate-100"
                                            aria-invalid={
                                                !!errors.currency_code
                                            }
                                        />
                                        <InputError
                                            message={errors.currency_code}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="due_amount"
                                            className="text-slate-300"
                                        >
                                            Due Amount{' '}
                                            <span className="text-red-300">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Banknote className="absolute top-2.5 left-3 h-4 w-4 text-slate-500" />
                                            <Input
                                                id="due_amount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.due_amount}
                                                onChange={(event) =>
                                                    setData(
                                                        'due_amount',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="0.00"
                                                className="border-slate-700 bg-slate-900 pl-10 text-slate-100"
                                                aria-invalid={
                                                    !!errors.due_amount
                                                }
                                            />
                                        </div>
                                        <InputError
                                            message={errors.due_amount}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="min_amount"
                                                className="text-slate-300"
                                            >
                                                Min Amount
                                                {data.allow_partial_payment && (
                                                    <span className="text-red-300">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="min_amount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.min_amount}
                                                required={
                                                    data.allow_partial_payment
                                                }
                                                disabled={
                                                    !data.allow_partial_payment
                                                }
                                                onChange={(event) =>
                                                    setData(
                                                        'min_amount',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="0.00"
                                                className="border-slate-700 bg-slate-900 text-slate-100"
                                                aria-invalid={
                                                    !!errors.min_amount
                                                }
                                            />
                                            <InputError
                                                message={errors.min_amount}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="max_amount"
                                                className="text-slate-300"
                                            >
                                                Max Amount
                                                {data.allow_partial_payment && (
                                                    <span className="text-red-300">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="max_amount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={data.max_amount}
                                                required={
                                                    data.allow_partial_payment
                                                }
                                                disabled={
                                                    !data.allow_partial_payment
                                                }
                                                onChange={(event) =>
                                                    setData(
                                                        'max_amount',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="0.00"
                                                className="border-slate-700 bg-slate-900 text-slate-100"
                                                aria-invalid={
                                                    !!errors.max_amount
                                                }
                                            />
                                            <InputError
                                                message={errors.max_amount}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="py-6">
                                <CardHeader className="flex flex-row items-start justify-between gap-4">
                                    <div>
                                        <CardTitle>Payment Settings</CardTitle>
                                        <CardDescription>
                                            Configure optional payment behavior.
                                        </CardDescription>
                                    </div>
                                    <Settings2 className="h-5 w-5 text-blue-600" />
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="allow_partial_payment">
                                                Allow Partial Payment
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Allow customers to pay in
                                                installments.
                                            </p>
                                        </div>
                                        <Switch
                                            id="allow_partial_payment"
                                            checked={data.allow_partial_payment}
                                            onCheckedChange={(checked) => {
                                                setData(
                                                    'allow_partial_payment',
                                                    checked,
                                                );

                                                if (!checked) {
                                                    setData('min_amount', '');
                                                    setData('max_amount', '');
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="scheduled_payment">
                                                Scheduled Payment
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                Auto-process at a future date.
                                            </p>
                                        </div>
                                        <Switch
                                            id="scheduled_payment"
                                            checked={data.scheduled_payment}
                                            onCheckedChange={(checked) => {
                                                setData('scheduled_payment', checked);

                                                // if (!checked) {
                                                //     setData('billing_frequency', 'one_time',);
                                                //     setData('due_date', '');
                                                // }
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {data.scheduled_payment && (
                                <Card className="py-6">
                                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                                        <div>
                                            <CardTitle>Payment Terms</CardTitle>
                                            <CardDescription>
                                                Define schedule terms for this
                                                invoice.
                                            </CardDescription>
                                        </div>
                                        <CalendarClock className="h-5 w-5 text-blue-600" />
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Billing Frequency</Label>
                                            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                                                {billingFrequencyOptions.map(
                                                    (option) => {
                                                        const Icon =
                                                            option.icon;
                                                        const selected =
                                                            data.billing_frequency ===
                                                            option.value;

                                                        return (
                                                            <button
                                                                key={
                                                                    option.value
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    setData('billing_frequency', option.value)
                                                                }
                                                                className={`flex min-h-22 flex-col items-center justify-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors ${
                                                                    selected
                                                                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950/40'
                                                                        : 'border-border bg-background text-muted-foreground hover:border-blue-300 hover:text-foreground'
                                                                }`}
                                                            >
                                                                <Icon className="h-5 w-5" />
                                                                {option.label}
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            <InputError
                                                message={
                                                    errors.billing_frequency
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="due_date">
                                                Due Date {" "}
                                                {data.scheduled_payment && (
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="due_date"
                                                type="date"
                                                value={data.due_date}
                                                onChange={(event) =>
                                                    setData(
                                                        'due_date',
                                                        event.target.value,
                                                    )
                                                }
                                                aria-invalid={!!errors.due_date}
                                            />
                                            <InputError
                                                message={errors.due_date}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_repetitions">
                                                Number of repetitions {" "}
                                                {data.scheduled_payment && (
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="number_of_repetitions"
                                                type="number"
                                                min={1}
                                                step={1}
                                                value={data.number_of_repetitions ?? 1}
                                                onChange={(event) =>
                                                    setData(
                                                        'number_of_repetitions',
                                                        event.target.value,
                                                    )
                                                }
                                                aria-invalid={
                                                    !!errors.number_of_repetitions
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.number_of_repetitions
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={processing}
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Create Invoice
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
