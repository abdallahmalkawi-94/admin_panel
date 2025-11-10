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
import { Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Banks',
        href: '/banks',
    },
    {
        title: 'Create a new bank',
        href: '/banks/create',
    },
];

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        en_name: '',
        ar_name: '',
        swift_code: '',
        logo: null as File | null,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/banks', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create a new bank" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create a new bank
                        </h1>
                        <p className="text-muted-foreground">
                            Add a new bank to the system
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bank Information</CardTitle>
                        <CardDescription>
                            Enter the details for the new bank
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
                                    {processing ? 'Creating...' : 'Create Bank'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

