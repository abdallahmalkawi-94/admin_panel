import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Psp, type PspStatus } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { FormEventHandler } from 'react';
import {
    BankDropDown,
    CountryDropDown,
    CurrencyDropDown,
} from '@/types/dropdown';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'PSPs',
        href: '/psps',
    },
    {
        title: 'Edit PSP',
        href: '#',
    },
];

interface EditProps {
    psp: Psp;
    countries: CountryDropDown[];
    currencies: CurrencyDropDown[];
    statuses: PspStatus[];
    banks: BankDropDown[]
}

export default function Edit({ psp, countries, currencies, statuses, banks }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: psp.name || '',
        country_code: psp.country_code || '',
        settlement_currency_code: psp.settlement_currency_code || '',
        monthly_fees: psp.monthly_fees?.toString() || '',
        psp_status_id: psp.psp_status_id?.toString() || '',
        contact_person: psp.contact_person || '',
        contact_email: psp.contact_email || '',
        base_url: psp.base_url || '',
        sdk_version: psp.sdk_version || '',
        dashboard_url: psp.dashboard_url || '',
        support_money_splitting: psp.support_money_splitting || false,
        notes: psp.notes || '',
        attachment: null as File | null,
        password: '',
        bank_account_number: psp.bank_account_number || '',
        swift_code: psp?.swift_code || '',
        iban: psp.iban || '',
        enable_auto_transfer: psp.enable_auto_transfer || false,
        bank_id: psp?.bank_id?.toString() || '',
        _method: 'PATCH',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/psps/${psp.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit PSP: ${psp.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit PSP</h1>
                        <p className="text-muted-foreground">
                            Update PSP information and settings
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Update the basic details for the PSP
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name & Code */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="PSP Name"
                                        aria-invalid={!!errors.name}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="monthly_fees">
                                        Monthly Fees <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="monthly_fees"
                                        type="number"
                                        step="0.01"
                                        value={data.monthly_fees}
                                        onChange={(e) => setData('monthly_fees', e.target.value)}
                                        placeholder="0.00"
                                        aria-invalid={!!errors.monthly_fees}
                                    />
                                    {errors.monthly_fees && (
                                        <p className="text-sm text-destructive">{errors.monthly_fees}</p>
                                    )}
                                </div>
                            </div>

                            {/* Country & Currency */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="country_id">
                                        Country <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.country_code}
                                        onValueChange={(value) => setData('country_code', value)}
                                    >
                                        <SelectTrigger id="country_id" aria-invalid={!!errors.country_code}>
                                            <SelectValue placeholder="Select a country" />
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
                                    {errors.country_code && (
                                        <p className="text-sm text-destructive">{errors.country_code}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="settlement_currency_id">
                                        Settlement Currency <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.settlement_currency_code}
                                        onValueChange={(value) => setData('settlement_currency_code', value)}
                                    >
                                        <SelectTrigger
                                            id="settlement_currency_id"
                                            aria-invalid={!!errors.settlement_currency_code}
                                        >
                                            <SelectValue placeholder="Select a currency" />
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
                                    {errors.settlement_currency_code && (
                                        <p className="text-sm text-destructive">
                                            {errors.settlement_currency_code}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Document & Status */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="psp_status_id">
                                        Status <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={data.psp_status_id}
                                        onValueChange={(value) => setData('psp_status_id', value)}
                                    >
                                        <SelectTrigger
                                            id="psp_status_id"
                                            aria-invalid={!!errors.psp_status_id}
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
                                    {errors.psp_status_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.psp_status_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="attachment">Attachment (ZIP or RAR)</Label>
                                    <Input
                                        id="attachment"
                                        type="file"
                                        accept=".zip,.rar,application/zip,application/x-rar-compressed"
                                        onChange={(e) =>
                                            setData('attachment', e.target.files?.[0] || null)
                                        }
                                        aria-invalid={!!errors.attachment}
                                    />
                                    {errors.attachment && (
                                        <p className="text-sm text-destructive">{errors.attachment}</p>
                                    )}
                                    {psp.attachment && (
                                        <p className="text-sm text-muted-foreground">
                                            Current: {psp.attachment.split('/').pop()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                PSP contact details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_person">Contact Person</Label>
                                    <Input
                                        id="contact_person"
                                        type="text"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        placeholder="John Doe"
                                        aria-invalid={!!errors.contact_person}
                                    />
                                    {errors.contact_person && (
                                        <p className="text-sm text-destructive">
                                            {errors.contact_person}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Contact Email</Label>
                                    <Input
                                        id="contact_email"
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="contact@psp.com"
                                        aria-invalid={!!errors.contact_email}
                                    />
                                    {errors.contact_email && (
                                        <p className="text-sm text-destructive">
                                            {errors.contact_email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Details</CardTitle>
                            <CardDescription>
                                API and technical configuration
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="base_url">Base URL</Label>
                                    <Input
                                        id="base_url"
                                        type="url"
                                        value={data.base_url}
                                        onChange={(e) => setData('base_url', e.target.value)}
                                        placeholder="https://api.psp.com"
                                        aria-invalid={!!errors.base_url}
                                    />
                                    {errors.base_url && (
                                        <p className="text-sm text-destructive">{errors.base_url}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sdk_version">SDK Version</Label>
                                    <Input
                                        id="sdk_version"
                                        type="text"
                                        value={data.sdk_version}
                                        onChange={(e) => setData('sdk_version', e.target.value)}
                                        placeholder="v1.0.0"
                                        aria-invalid={!!errors.sdk_version}
                                    />
                                    {errors.sdk_version && (
                                        <p className="text-sm text-destructive">{errors.sdk_version}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dashboard_url">Dashboard URL</Label>
                                    <Input
                                        id="dashboard_url"
                                        type="url"
                                        value={data.dashboard_url}
                                        onChange={(e) => setData('dashboard_url', e.target.value)}
                                        placeholder="https://dashboard.psp.com"
                                        aria-invalid={!!errors.dashboard_url}
                                    />
                                    {errors.dashboard_url && (
                                        <p className="text-sm text-destructive">
                                            {errors.dashboard_url}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password (leave empty to keep current)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        aria-invalid={!!errors.password}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Banking Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Banking Details</CardTitle>
                            <CardDescription>
                                Bank account information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="bank_id">Bank</Label>
                                <div className="relative">
                                    <Select
                                        value={data.bank_id}
                                        onValueChange={(value) =>
                                            setData('bank_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="bank_id"
                                            aria-invalid={!!errors.bank_id}
                                        >
                                            <SelectValue placeholder="Select a bank" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {banks.map((bank) => (
                                                <SelectItem
                                                    key={`${bank.id}-${bank.en_name}`}
                                                    value={bank?.id?.toString()}
                                                >
                                                    {bank.en_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {data.bank_id && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-1/2 right-8 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
                                            onClick={() =>
                                                setData('bank_id', '')
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {errors.bank_id && (
                                    <p className="text-sm text-destructive">
                                        {errors.bank_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="bank_account_number">Bank Account Number</Label>
                                    <Input
                                        id="bank_account_number"
                                        type="text"
                                        value={data.bank_account_number}
                                        onChange={(e) =>
                                            setData('bank_account_number', e.target.value)
                                        }
                                        placeholder="1234567890"
                                        aria-invalid={!!errors.bank_account_number}
                                    />
                                    {errors.bank_account_number && (
                                        <p className="text-sm text-destructive">
                                            {errors.bank_account_number}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="iban">IBAN</Label>
                                    <Input
                                        id="iban"
                                        type="text"
                                        value={data.iban}
                                        onChange={(e) => setData('iban', e.target.value)}
                                        placeholder="SA0000000000000000000000"
                                        aria-invalid={!!errors.iban}
                                    />
                                    {errors.iban && (
                                        <p className="text-sm text-destructive">{errors.iban}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enable_auto_transfer"
                                    checked={data.enable_auto_transfer}
                                    onCheckedChange={(checked) =>
                                        setData('enable_auto_transfer', checked)
                                    }
                                />
                                <Label htmlFor="enable_auto_transfer">Enable Auto Transfer</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="support_money_splitting"
                                    checked={data.support_money_splitting}
                                    onCheckedChange={(checked) =>
                                        setData('support_money_splitting', checked)
                                    }
                                />
                                <Label htmlFor="support_money_splitting">
                                    Support Money Splitting
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Information</CardTitle>
                            <CardDescription>
                                Any additional notes or comments
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Enter any additional notes..."
                                    rows={4}
                                    aria-invalid={!!errors.notes}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-destructive">{errors.notes}</p>
                                )}
                            </div>
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
                            {processing ? 'Updating...' : 'Update PSP'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

