import AppLayout from '@/layouts/app-layout';
import { type PaymentNetwork, type BreadcrumbItem } from '@/types';
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
import { Save, X, Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payment Networks',
        href: '/payment-networks',
    },
    {
        title: 'Edit Payment Network',
        href: '#',
    },
];

interface EditProps {
    paymentNetwork: PaymentNetwork;
}

export default function Edit({ paymentNetwork }: EditProps) {
    const [tagInput, setTagInput] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        name: paymentNetwork.name || '',
        tags: paymentNetwork.tags || [],
        _method: 'PATCH',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/payment-networks/${paymentNetwork.id}`);
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setData(
            'tags',
            data.tags.filter((_, i) => i !== index),
        );
    };

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Payment Network: ${paymentNetwork.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Payment Network
                        </h1>
                        <p className="text-muted-foreground">
                            Update payment network information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Network Information</CardTitle>
                        <CardDescription>
                            Update the details for the payment network
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Name{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Payment network name"
                                    maxLength={100}
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="tags"
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onKeyPress={handleTagKeyPress}
                                        placeholder="Enter a tag and press Enter"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addTag}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {data.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {data.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTag(index)
                                                    }
                                                    className="ml-1 rounded-full hover:bg-blue-200"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {errors.tags && (
                                    <p className="text-sm text-destructive">
                                        {errors.tags}
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
                                    {processing
                                        ? 'Updating...'
                                        : 'Update Payment Network'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
