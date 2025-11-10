import AppLayout from '@/layouts/app-layout';
import { type Bank, type BreadcrumbItem } from '@/types';
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
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banks',
        href: '/banks',
    },
    {
        title: 'Edit Bank',
        href: '#',
    },
];

interface EditProps {
    bank: Bank;
}

export default function Edit({ bank }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        en_name: bank.en_name || '',
        ar_name: bank.ar_name || '',
        swift_code: bank.swift_code || '',
        logo: null as File | null,
        _method: 'PATCH',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/banks/${bank.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Bank: ${bank.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Bank
                        </h1>
                        <p className="text-muted-foreground">
                            Update bank information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bank Information</CardTitle>
                        <CardDescription>
                            Update the details for the bank
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        placeholder="Bank English Name"
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
                                        placeholder="اسم البنك بالعربية"
                                        aria-invalid={!!errors.ar_name}
                                    />
                                    {errors.ar_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.ar_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* SWIFT Code */}
                            <div className="space-y-2">
                                <Label htmlFor="swift_code">SWIFT Code</Label>
                                <Input
                                    id="swift_code"
                                    type="text"
                                    value={data.swift_code}
                                    onChange={(e) =>
                                        setData('swift_code', e.target.value)
                                    }
                                    placeholder="ABCDSA12345"
                                    aria-invalid={!!errors.swift_code}
                                />
                                {errors.swift_code && (
                                    <p className="text-sm text-destructive">
                                        {errors.swift_code}
                                    </p>
                                )}
                            </div>

                            {/* Logo */}
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
                                {bank.logo_url && (
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Current logo:
                                        </p>
                                        <img
                                            src={bank.logo_url}
                                            alt="Current logo"
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    </div>
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
                                    {processing ? 'Updating...' : 'Update Bank'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

