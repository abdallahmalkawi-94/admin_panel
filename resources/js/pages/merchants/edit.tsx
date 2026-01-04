import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Merchant } from '@/types';
import { Head, useForm } from '@inertiajs/react';
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
import { MultiSelect } from '@/components/ui/multi-select';
import { Save } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import axios from 'axios';
import {
    BankDropDown,
    CountryDropDown,
    CurrencyDropDown,
    InvoiceTypeDropDown,
    MerchantStatusDropDown,
    ProductDropDown,
    TermsAndConditionDropDown,
} from '@/types/dropdown';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Merchants',
        href: '/merchants',
    },
    {
        title: 'Edit Merchant',
        href: '#',
    },
];

interface MerchantItem {
    id: number;
    en_name: string;
    ar_name: string;
}

interface EditProps {
    merchant: Merchant;
    products: ProductDropDown[];
    statuses: MerchantStatusDropDown[];
    banks: BankDropDown[];
    termsAndConditions: TermsAndConditionDropDown[];
    countries: CountryDropDown[];
    currencies: CurrencyDropDown[];
    invoiceTypes: InvoiceTypeDropDown[];
}

export default function Edit({
    merchant,
    products,
    statuses,
    banks,
    termsAndConditions,
    countries,
    currencies,
    invoiceTypes,
}: EditProps) {
    const [availableParentMerchants, setAvailableParentMerchants] = useState<MerchantItem[]>([]);
    const [loadingMerchants, setLoadingMerchants] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        en_name: merchant.en_name || '',
        ar_name: merchant.ar_name || '',
        commercial_registry_name: merchant.commercial_registry_name || '',
        product_id: merchant.product_id?.toString() || '',
        referral_id: merchant.referral_id?.toString() || '',
        parent_merchant_id: merchant.parent_merchant_id?.toString() || '',
        status_id: merchant.status_id?.toString() || '',
        is_live: merchant.is_live || false,
        logo: null as File | null,
        attachment: null as File | null,
        invoice_type_ids: (merchant.invoice_type_ids || []) as number[],
        // Settings - Nested structure to match create form
        settings: {
            payout_model: merchant.settings?.payout_model?.toString() || '1',
            bank_id: merchant.settings?.bank_id?.toString() || '',
            iban: merchant.settings?.iban || '',
            bank_account_no: merchant.settings?.bank_account_no || '',
            supported_order_type:
                merchant.settings?.supported_order_type?.toString() || '1',
            has_custom_urls: merchant.settings?.has_custom_urls || false,
            urls_settings: {
                callback_url: merchant.settings?.urls_settings?.callback_url || '',
                webhook_url: merchant.settings?.urls_settings?.webhook_url || '',
                invoice_inquiry_url:
                    merchant.settings?.urls_settings?.invoice_inquiry_url || '',
                invoice_creation_url:
                    merchant.settings?.urls_settings?.invoice_creation_url || '',
                token_key: merchant.settings?.urls_settings?.token_key || '',
            },
            terms_and_condition_id:
                merchant.settings?.terms_and_condition_id?.toString() || '',
            is_enable_sms_notification:
                merchant.settings?.is_enable_sms_notification || false,
            monthly_sms: merchant.settings?.monthly_sms || 0,
            daily_sms: merchant.settings?.daily_sms || 0,
            monthly_sms_counter: merchant.settings?.monthly_sms_counter || 0,
            daily_sms_counter: merchant.settings?.daily_sms_counter || 0,
            is_enable_email_notification:
                merchant.settings?.is_enable_email_notification || false,
            is_enable_auto_redirect:
                merchant.settings?.is_enable_auto_redirect || false,
            country_code: merchant.settings?.country_code || '',
            currency_code: merchant.settings?.currency_code || '',
        },
        _method: 'PATCH',
    });

    // Fetch parent merchants when product changes
    useEffect(() => {
        if (data.product_id) {
            setLoadingMerchants(true);
            axios.get('/merchants/parent-merchants-by-product', {
                params: { product_id: data.product_id }
            })
            .then(response => {
                setAvailableParentMerchants(response.data.merchants);
            })
            .catch(error => {
                console.error('Error fetching parent merchants:', error);
                setAvailableParentMerchants([]);
            })
            .finally(() => {
                setLoadingMerchants(false);
            });
        } else {
            setAvailableParentMerchants([]);
        }
    }, [data.product_id]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/merchants/${merchant.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Merchant: ${merchant.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Merchant
                        </h1>
                        <p className="text-muted-foreground">
                            Update merchant information and settings
                        </p>
                    </div>
                </div>

                {/* Form - same structure as create but with pre-filled data */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Update the basic details for the merchant
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* En & Ar Name */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="en_name">
                                        English Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="en_name"
                                        type="text"
                                        value={data.en_name}
                                        onChange={(e) =>
                                            setData('en_name', e.target.value)
                                        }
                                        placeholder="English Name"
                                        aria-invalid={!!errors.en_name}
                                    />
                                    {errors.en_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.en_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ar_name">
                                        Arabic Name{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="ar_name"
                                        type="text"
                                        value={data.ar_name}
                                        onChange={(e) =>
                                            setData('ar_name', e.target.value)
                                        }
                                        placeholder="Arabic Name"
                                        aria-invalid={!!errors.ar_name}
                                    />
                                    {errors.ar_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.ar_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Commercial Registry & Referral ID */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="commercial_registry_name">
                                        Commercial Registry Name
                                    </Label>
                                    <Input
                                        id="commercial_registry_name"
                                        type="text"
                                        value={data.commercial_registry_name}
                                        onChange={(e) =>
                                            setData(
                                                'commercial_registry_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Commercial Registry Name"
                                        aria-invalid={
                                            !!errors.commercial_registry_name
                                        }
                                    />
                                    {errors.commercial_registry_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.commercial_registry_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="referral_id">
                                        Referral ID{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="referral_id"
                                        type="number"
                                        value={data.referral_id}
                                        onChange={(e) =>
                                            setData('referral_id', e.target.value)
                                        }
                                        placeholder="123456"
                                        aria-invalid={!!errors.referral_id}
                                    />
                                    {errors.referral_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.referral_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Product, Parent Merchant */}
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
                                            aria-invalid={!!errors.product_id}
                                        >
                                            <SelectValue placeholder="Select a product" />
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
                                    {errors.product_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.product_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="parent_merchant_id">
                                        Parent Merchant
                                    </Label>
                                    <Select
                                        value={data.parent_merchant_id}
                                        onValueChange={(value) =>
                                            setData('parent_merchant_id', value)
                                        }
                                        disabled={!data.product_id || loadingMerchants}
                                    >
                                        <SelectTrigger
                                            id="parent_merchant_id"
                                            aria-invalid={
                                                !!errors.parent_merchant_id
                                            }
                                        >
                                            <SelectValue placeholder={
                                                !data.product_id
                                                    ? "Select a product first"
                                                    : loadingMerchants
                                                    ? "Loading..."
                                                    : "Select parent merchant"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableParentMerchants.length === 0 && data.product_id && !loadingMerchants ? (
                                                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                                    No parent merchants available for this product
                                                </div>
                                            ) : (
                                                availableParentMerchants.map((merchant) => (
                                                    <SelectItem
                                                        key={merchant.id}
                                                        value={merchant.id.toString()}
                                                    >
                                                        {merchant.en_name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {errors.parent_merchant_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.parent_merchant_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Logo</Label>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setData(
                                                'logo',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        aria-invalid={!!errors.logo}
                                    />
                                    {errors.logo && (
                                        <p className="text-sm text-destructive">
                                            {errors.logo}
                                        </p>
                                    )}
                                    {merchant.logo_url && (
                                        <img
                                            src={merchant.logo_url}
                                            alt="Current logo"
                                            className="mt-2 h-20 w-20 rounded object-cover"
                                        />
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="attachment">Attachment (ZIP or RAR)</Label>
                                    <Input
                                        id="attachment"
                                        type="file"
                                        accept=".zip,.rar,application/zip,application/x-rar-compressed"
                                        onChange={(e) =>
                                            setData(
                                                'attachment',
                                                e.target.files?.[0] || null,
                                            )
                                        }
                                        aria-invalid={!!errors.attachment}
                                    />
                                    {errors.attachment && (
                                        <p className="text-sm text-destructive">
                                            {errors.attachment}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Invoice Types */}
                            {!data.parent_merchant_id && (
                                <div className="space-y-2">
                                    <Label htmlFor="invoice_types">
                                        Invoice Types{' '}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <MultiSelect
                                        options={invoiceTypes.map((type) => ({
                                            id: type.id,
                                            label: type.description,
                                        }))}
                                        selected={data.invoice_type_ids}
                                        onChange={(values) =>
                                            setData('invoice_type_ids', values)
                                        }
                                        placeholder="Select invoice types..."
                                        error={!!errors.invoice_type_ids}
                                    />
                                    {errors.invoice_type_ids && (
                                        <p className="text-sm text-destructive">
                                            {errors.invoice_type_ids}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Mode and Status */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="status_id">
                                        Status{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.status_id}
                                        onValueChange={(value) =>
                                            setData('status_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="status_id"
                                            aria-invalid={!!errors.status_id}
                                        >
                                            <SelectValue placeholder="Select a status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statuses.map((status) => (
                                                <SelectItem
                                                    key={status.id}
                                                    value={status.id.toString()}
                                                >
                                                    {status.description}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.status_id}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_live"
                                        checked={data.is_live}
                                        onCheckedChange={(checked) =>
                                            setData('is_live', checked)
                                        }
                                    />
                                    <Label htmlFor="is_live">Live Mode</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Merchant Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Merchant Settings</CardTitle>
                            <CardDescription>
                                Configure SMS, email and other settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Country & Currency */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="country">
                                        Country{' '}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.settings.country_code}
                                        onValueChange={(value) =>
                                            setData('settings.country_code', value)
                                        }
                                    >
                                        <SelectTrigger id="country_code">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country, index) => (
                                                <SelectItem
                                                    key={`${country.code}-${index}`}
                                                    value={country.code}
                                                >
                                                    {country.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['settings.country_code'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['settings.country_code']}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency_code">
                                        Currency{' '}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.settings.currency_code}
                                        onValueChange={(value) =>
                                            setData('settings.currency_code', value)
                                        }
                                    >
                                        <SelectTrigger id="currency_code">
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map((currency, index) => (
                                                <SelectItem
                                                    key={`${currency.code}-${index}`}
                                                    value={currency.code}
                                                >
                                                    {currency.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['settings.currency_code'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['settings.currency_code']}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="terms_and_condition_id">
                                        Terms and Conditions{' '}
                                        <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.settings.terms_and_condition_id}
                                        onValueChange={(value) =>
                                            setData('settings.terms_and_condition_id', value)
                                        }
                                    >
                                        <SelectTrigger id="terms_and_condition_id">
                                            <SelectValue placeholder="Select terms and conditions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {termsAndConditions.map((terms) => (
                                                <SelectItem
                                                    key={terms.id}
                                                    value={terms.id.toString()}
                                                >
                                                    Version {terms.version}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['settings.terms_and_condition_id'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['settings.terms_and_condition_id']}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supported_order_type">
                                        Supported Order Type{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.settings.supported_order_type}
                                        onValueChange={(value) =>
                                            setData('settings.supported_order_type', value)
                                        }
                                    >
                                        <SelectTrigger id="supported_order_type">
                                            <SelectValue placeholder="Select order type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Push
                                            </SelectItem>
                                            <SelectItem value="2">
                                                Pull
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors['settings.supported_order_type'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['settings.supported_order_type']}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_enable_auto_redirect"
                                    checked={data.settings.is_enable_auto_redirect}
                                    onCheckedChange={(checked) =>
                                        setData('settings.is_enable_auto_redirect', checked)
                                    }
                                />
                                <Label htmlFor="is_enable_auto_redirect">
                                    Enable Auto Redirect
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_enable_email_notification"
                                    checked={
                                        data.settings.is_enable_email_notification
                                    }
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'settings.is_enable_email_notification',
                                            checked,
                                        )
                                    }
                                />
                                <Label htmlFor="is_enable_email_notification">
                                    Enable Email Notifications
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_enable_sms_notification"
                                    checked={data.settings.is_enable_sms_notification}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'settings.is_enable_sms_notification',
                                            checked,
                                        )
                                    }
                                />
                                <Label htmlFor="is_enable_sms_notification">
                                    Enable SMS Notifications
                                </Label>
                            </div>
                            {data.settings.is_enable_sms_notification && (
                                <>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="monthly_sms">
                                                Monthly SMS Limit
                                            </Label>
                                            <Input
                                                id="monthly_sms"
                                                type="number"
                                                value={data.settings.monthly_sms}
                                                onChange={(e) =>
                                                    setData(
                                                        'settings.monthly_sms',
                                                        parseInt(e.target.value) || 0,
                                                    )
                                                }
                                                placeholder="1000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="daily_sms">
                                                Daily SMS Limit
                                            </Label>
                                            <Input
                                                id="daily_sms"
                                                type="number"
                                                value={data.settings.daily_sms}
                                                onChange={(e) =>
                                                    setData(
                                                        'settings.daily_sms',
                                                        parseInt(e.target.value) || 0,
                                                    )
                                                }
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="monthly_sms_counter">
                                                Monthly SMS Counter
                                            </Label>
                                            <Input
                                                id="monthly_sms_counter"
                                                type="number"
                                                value={data.settings.monthly_sms_counter}
                                                onChange={(e) =>
                                                    setData(
                                                        'settings.monthly_sms_counter',
                                                        parseInt(e.target.value) || 0,
                                                    )
                                                }
                                                placeholder="1000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="daily_sms_counter">
                                                Daily SMS Counter
                                            </Label>
                                            <Input
                                                id="daily_sms_counter"
                                                type="number"
                                                value={data.settings.daily_sms_counter}
                                                onChange={(e) =>
                                                    setData(
                                                        'settings.daily_sms_counter',
                                                        parseInt(e.target.value) || 0,
                                                    )
                                                }
                                                placeholder="100"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Has Custom URLs Switch */}
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="has_custom_urls"
                                    checked={data.settings.has_custom_urls}
                                    onCheckedChange={(checked) =>
                                        setData('settings.has_custom_urls', checked)
                                    }
                                />
                                <Label htmlFor="has_custom_urls">
                                    Has Custom URLs
                                </Label>
                            </div>
                            {/* Custom URLs - Show when has_custom_urls is enabled */}
                            {data.settings.has_custom_urls && (
                                <>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="callback_url">
                                                Callback URL
                                            </Label>
                                            <Input
                                                id="callback_url"
                                                type="url"
                                                value={data.settings.urls_settings.callback_url}
                                                onChange={(e) =>
                                                    setData('settings.urls_settings.callback_url', e.target.value)
                                                }
                                                placeholder="https://example.com/callback"
                                                aria-invalid={!!errors['settings.urls_settings.callback_url']}
                                            />
                                            {errors['settings.urls_settings.callback_url'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['settings.urls_settings.callback_url']}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="webhook_url">
                                                Webhook URL
                                            </Label>
                                            <Input
                                                id="webhook_url"
                                                type="url"
                                                value={data.settings.urls_settings.webhook_url}
                                                onChange={(e) =>
                                                    setData('settings.urls_settings.webhook_url', e.target.value)
                                                }
                                                placeholder="https://example.com/webhook"
                                                aria-invalid={!!errors['settings.urls_settings.webhook_url']}
                                            />
                                            {errors['settings.urls_settings.webhook_url'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['settings.urls_settings.webhook_url']}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="invoice_inquiry_url">
                                                Invoice Inquiry URL
                                            </Label>
                                            <Input
                                                id="invoice_inquiry_url"
                                                type="url"
                                                value={data.settings.urls_settings.invoice_inquiry_url}
                                                onChange={(e) =>
                                                    setData('settings.urls_settings.invoice_inquiry_url', e.target.value)
                                                }
                                                placeholder="https://example.com/invoice/inquiry"
                                                aria-invalid={!!errors['settings.urls_settings.invoice_inquiry_url']}
                                            />
                                            {errors['settings.urls_settings.invoice_inquiry_url'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['settings.urls_settings.invoice_inquiry_url']}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="invoice_creation_url">
                                                Invoice Creation URL
                                            </Label>
                                            <Input
                                                id="invoice_creation_url"
                                                type="url"
                                                value={data.settings.urls_settings.invoice_creation_url}
                                                onChange={(e) =>
                                                    setData('settings.urls_settings.invoice_creation_url', e.target.value)
                                                }
                                                placeholder="https://example.com/invoice/create"
                                                aria-invalid={!!errors['settings.urls_settings.invoice_creation_url']}
                                            />
                                            {errors['settings.urls_settings.invoice_creation_url'] && (
                                                <p className="text-sm text-destructive">
                                                    {errors['settings.urls_settings.invoice_creation_url']}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="token_key">
                                            Token Key
                                        </Label>
                                        <Input
                                            id="token_key"
                                            type="text"
                                            value={data.settings.urls_settings.token_key}
                                            onChange={(e) =>
                                                setData('settings.urls_settings.token_key', e.target.value)
                                            }
                                            placeholder="Enter token key"
                                            aria-invalid={!!errors['settings.urls_settings.token_key']}
                                        />
                                        {errors['settings.urls_settings.token_key'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['settings.urls_settings.token_key']}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Financial Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Settings</CardTitle>
                            <CardDescription>
                                Configure payout and banking details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Payout Model & Supported Order Type */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="payout_model">
                                        Payout Model{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.settings.payout_model}
                                        onValueChange={(value) =>
                                            setData('settings.payout_model', value)
                                        }
                                    >
                                        <SelectTrigger id="payout_model">
                                            <SelectValue placeholder="Select payout model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">
                                                Manual
                                            </SelectItem>
                                            <SelectItem value="2">
                                                Daily
                                            </SelectItem>
                                            <SelectItem value="3">
                                                Weekly
                                            </SelectItem>
                                            <SelectItem value="4">
                                                Monthly
                                            </SelectItem>
                                            <SelectItem value="5">
                                                Annual
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors['settings.payout_model'] && (
                                        <p className="text-sm text-destructive">
                                            {errors['settings.payout_model']}
                                        </p>
                                    )}
                                </div>
                                {data.settings.payout_model !== '1' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="bank_id">Bank{' '}
                                            {data.settings.payout_model !== '1' && <span className="text-destructive">*</span>}
                                        </Label>
                                        <Select
                                            value={data.settings.bank_id}
                                            onValueChange={(value) =>
                                                setData('settings.bank_id', value)
                                            }
                                        >
                                            <SelectTrigger id="bank_id">
                                                <SelectValue placeholder="Select a bank" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {banks.map((bank) => (
                                                    <SelectItem
                                                        key={bank.id}
                                                        value={bank.id.toString()}
                                                    >
                                                        {bank.en_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors['settings.bank_id'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['settings.bank_id']}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Bank, IBAN, Account No - Hidden if payout model is Manual */}
                            {data.settings.payout_model !== '1' && (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="iban">IBAN</Label>
                                        <Input
                                            id="iban"
                                            type="text"
                                            value={data.settings.iban}
                                            onChange={(e) =>
                                                setData('settings.iban', e.target.value)
                                            }
                                            placeholder="SA0000000000000000000000"
                                            aria-invalid={!!errors['settings.iban']}
                                        />
                                        {errors['settings.iban'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['settings.iban']}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bank_account_no">
                                            Bank Account Number{' '}
                                            {data.settings.payout_model !== '1' && <span className="text-destructive">*</span>}
                                        </Label>
                                        <Input
                                            id="bank_account_no"
                                            type="text"
                                            value={data.settings.bank_account_no}
                                            onChange={(e) =>
                                                setData(
                                                    'settings.bank_account_no',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="1234567890"
                                            aria-invalid={!!errors['settings.bank_account_no']}
                                        />
                                        {errors['settings.bank_account_no'] && (
                                            <p className="text-sm text-destructive">
                                                {errors['settings.bank_account_no']}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
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
                            {processing ? 'Updating...' : 'Update Merchant'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

