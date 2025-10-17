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
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import products from '@/routes/products';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, Save } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Edit Product',
        href: '#',
    },
];

interface EditProps {
    product: Product;
}

export default function Edit({ product }: EditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        en_name: product.en_name || '',
        ar_name: product.ar_name || '',
        signing_active: product.signing_active || false,
        callback_url: product.callback_url || '',
        webhook_url: product.webhook_url || '',
        invoice_inquiry_api: product.invoice_inquiry_api || '',
        invoice_creation_api: product.invoice_creation_api || '',
        hmac_key: product.hmac_key || '',
        token_key: product.token_key || '',
        secret_key: product.secret_key || '',
    });

    const generateSecretKey = () => {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint8Array(20);
        window.crypto.getRandomValues(array);
        return Array.from(array, (num) => characters[num % characters.length]).join(
            '',
        );
    };

    const handleGenerateSecretKey = () => {
        const newSecretKey = generateSecretKey();
        setData('secret_key', newSecretKey);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(products.update.url(product.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Product - ${product.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Product
                        </h1>
                        <p className="text-muted-foreground">
                            Update product information and configuration
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={`/products/${product.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Product
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Information</CardTitle>
                        <CardDescription>
                            Update the details for this product
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
                                        placeholder="Product Name"
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
                                        placeholder="اسم المنتج"
                                        aria-invalid={!!errors.ar_name}
                                    />
                                    {errors.ar_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.ar_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Callback & Webhook URL */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="callback_url">
                                        Callback URL
                                    </Label>
                                    <Input
                                        id="callback_url"
                                        type="url"
                                        value={data.callback_url}
                                        onChange={(e) =>
                                            setData(
                                                'callback_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://example.com/callback"
                                        aria-invalid={!!errors.callback_url}
                                    />
                                    {errors.callback_url && (
                                        <p className="text-sm text-destructive">
                                            {errors.callback_url}
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
                                        value={data.webhook_url}
                                        onChange={(e) =>
                                            setData(
                                                'webhook_url',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://example.com/webhook"
                                        aria-invalid={!!errors.webhook_url}
                                    />
                                    {errors.webhook_url && (
                                        <p className="text-sm text-destructive">
                                            {errors.webhook_url}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* API URLs */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="invoice_inquiry_api">
                                        Invoice Inquiry API
                                    </Label>
                                    <Input
                                        id="invoice_inquiry_api"
                                        type="url"
                                        value={data.invoice_inquiry_api}
                                        onChange={(e) =>
                                            setData(
                                                'invoice_inquiry_api',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://example.com/api/inquiry"
                                        aria-invalid={
                                            !!errors.invoice_inquiry_api
                                        }
                                    />
                                    {errors.invoice_inquiry_api && (
                                        <p className="text-sm text-destructive">
                                            {errors.invoice_inquiry_api}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="invoice_creation_api">
                                        Invoice Creation API
                                    </Label>
                                    <Input
                                        id="invoice_creation_api"
                                        type="url"
                                        value={data.invoice_creation_api}
                                        onChange={(e) =>
                                            setData(
                                                'invoice_creation_api',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="https://example.com/api/create"
                                        aria-invalid={
                                            !!errors.invoice_creation_api
                                        }
                                    />
                                    {errors.invoice_creation_api && (
                                        <p className="text-sm text-destructive">
                                            {errors.invoice_creation_api}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Signing Active */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="signing_active">
                                            Signing Active
                                            <p className="text-sm text-muted-foreground">
                                                Enable HMAC signing for secure
                                                communication
                                            </p>
                                        </Label>
                                    </div>
                                    <Switch
                                        id="signing_active"
                                        checked={data.signing_active}
                                        onCheckedChange={(checked: boolean) =>
                                            setData('signing_active', checked)
                                        }
                                    />
                                </div>
                                {errors.signing_active && (
                                    <p className="text-sm text-destructive">
                                        {errors.signing_active}
                                    </p>
                                )}
                            </div>

                            {/* Security Keys */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="token_key">Token Key</Label>
                                    <Input
                                        id="token_key"
                                        type="text"
                                        value={data.token_key}
                                        onChange={(e) =>
                                            setData('token_key', e.target.value)
                                        }
                                        placeholder="Token Key"
                                        aria-invalid={!!errors.token_key}
                                    />
                                    {errors.token_key && (
                                        <p className="text-sm text-destructive">
                                            {errors.token_key}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hmac_key">
                                        HMAC Key
                                        {data.signing_active && (
                                            <span className="text-destructive">
                                                {' '}
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        id="hmac_key"
                                        type="text"
                                        disabled={!data.signing_active}
                                        value={data.hmac_key}
                                        onChange={(e) =>
                                            setData('hmac_key', e.target.value)
                                        }
                                        placeholder="HMAC key"
                                        aria-invalid={!!errors.hmac_key}
                                    />
                                    {errors.hmac_key && (
                                        <p className="text-sm text-destructive">
                                            {errors.hmac_key}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Secret Key */}
                            <div className="space-y-2">
                                <Label htmlFor="secret_key">
                                    Secret Key{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex">
                                    <Input
                                        id="secret_key"
                                        type="text"
                                        readOnly
                                        value={data.secret_key || ''}
                                        placeholder="Secret key"
                                        className="rounded-r-none"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleGenerateSecretKey}
                                        className="cursor-pointer rounded-l-none border border-l-0"
                                        variant="secondary"
                                    >
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Generate
                                    </Button>
                                </div>
                                {errors.secret_key && (
                                    <p className="text-sm text-destructive">
                                        {errors.secret_key}
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
                                        : 'Update Product'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
