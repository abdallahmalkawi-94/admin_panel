import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import users from '@/routes/users';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Create a new user',
        href: '/users/create',
    },
];

interface Country {
    code: string;
    name: string;
}

interface CreateProps {
    countries: Country[];
}

export default function Create({ countries }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        country_code: '',
        mobile_number: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(users.store.url(), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new user" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create a new user
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new user to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new user
                        </CardDescription>
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
                                    <Input
                                        id="mobile_number"
                                        type="text"
                                        value={data.mobile_number}
                                        onChange={(e) =>
                                            setData(
                                                'mobile_number',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="1234567890"
                                        aria-invalid={!!errors.mobile_number}
                                    />
                                    {errors.mobile_number && (
                                        <p className="text-sm text-destructive">
                                            {errors.mobile_number}
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
                                    {processing ? 'Creating...' : 'Create User'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
