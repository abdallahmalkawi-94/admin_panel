import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User, type UserStatus } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
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
import { PhoneInput } from '@/components/ui/phone-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, UserCog, Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import users from '@/routes/users';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Edit User',
        href: '#',
    },
];

interface Country {
    code: string;
    name: string;
}

interface EditProps {
    user: User;
    countries: Country[];
    statuses: UserStatus[];
}

export default function Edit({ user, countries, statuses }: EditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        country_code: user.country_code || '',
        mobile_number: user.mobile_number || '',
        status_id: user.status_id.toString() || '',
    });

    const [phoneValidationError, setPhoneValidationError] = useState<
        string | null
    >(null);
    const selectedCountry = countries.find(
        (country) => country.code === data.country_code,
    );
    const selectedStatus = statuses.find(
        (status) => status.id.toString() === data.status_id,
    );
    const statusVariant = (() => {
        const statusLabel = selectedStatus?.description?.toLowerCase() || '';
        if (statusLabel.includes('active')) return 'success';
        if (statusLabel.includes('inactive') || statusLabel.includes('blocked')) return 'destructive';
        if (statusLabel.includes('pending')) return 'info';
        return 'outline';
    })();

    const handlePhoneChange = (value: string | undefined) => {
        const phoneValue = value || '';
        setData('mobile_number', phoneValue);

        // Validate phone number
        if (phoneValue && !isValidPhoneNumber(phoneValue)) {
            setPhoneValidationError(
                'Please enter a valid international phone number',
            );
        } else {
            setPhoneValidationError(null);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Final validation before submit
        if (data.mobile_number && !isValidPhoneNumber(data.mobile_number)) {
            setPhoneValidationError(
                'Please enter a valid international phone number',
            );
            return;
        }

        patch(users.update.url(user.id), {
            onSuccess: () => {
                setPhoneValidationError(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-500/10 via-emerald-400/10 to-amber-400/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Sparkles className="h-4 w-4" />
                                User Workspace
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Edit User
                            </h1>
                            <p className="text-muted-foreground">
                                Keep identity and access status aligned.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={statusVariant}>
                                {selectedStatus?.description || 'Status pending'}
                            </Badge>
                            <Button asChild variant="outline">
                                <Link href="/users">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Users
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
                    {/* Form */}
                    <Card className='py-6'>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>User Information</CardTitle>
                                <CardDescription>
                                    Update the details for this user.
                                </CardDescription>
                            </div>
                            <UserCog className="h-5 w-5 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Full Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="John Doe"
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email & Mobile Number */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="john.doe@example.com"
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mobile_number">
                                        Mobile Number{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <PhoneInput
                                        id="mobile_number"
                                        defaultCountry="SA"
                                        value={data.mobile_number}
                                        onChange={handlePhoneChange}
                                        placeholder="Enter phone number"
                                        aria-invalid={
                                            !!(
                                                errors.mobile_number ||
                                                phoneValidationError
                                            )
                                        }
                                    />
                                    {(errors.mobile_number ||
                                        phoneValidationError) && (
                                        <p className="text-sm text-destructive">
                                            {errors.mobile_number ||
                                                phoneValidationError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Country */}
                            <div className="space-y-2">
                                <Label htmlFor="country_code">
                                    Country{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.country_code}
                                    onValueChange={(value) =>
                                        setData('country_code', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="country_code"
                                        aria-invalid={!!errors.country_code}
                                    >
                                        <SelectValue placeholder="Select a country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem
                                                key={country.code}
                                                value={country.code}
                                            >
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.country_code && (
                                    <p className="text-sm text-destructive">
                                        {errors.country_code}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status_id">
                                    Status{' '}
                                    <span className="text-destructive">*</span>
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

                                {/* Submit Buttons */}
                                <div className="flex items-center justify-end gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update User'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                        <Card className="border-muted/60 bg-muted/30 py-6">
                            <CardHeader>
                                <CardTitle>Live Summary</CardTitle>
                                <CardDescription>
                                    Snapshot of the current profile.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        User
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {data.name || 'User'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {data.email || 'Email pending'}
                                    </p>
                                </div>
                                <Badge variant={statusVariant}>
                                    {selectedStatus?.description || 'Status pending'}
                                </Badge>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span>{data.email || 'No email yet'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{data.mobile_number || 'No phone yet'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{selectedCountry?.name || 'Country pending'}</span>
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
