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
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import products from '@/routes/products';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, Save, Sparkles, Package, ShieldCheck, ShieldOff, Link as LinkIcon, Key, Code } from 'lucide-react';
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
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                <Sparkles className="h-4 w-4" />
                                Product Workspace
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Edit Product
                            </h1>
                            <p className="text-muted-foreground">
                                Keep configuration and signing policies in sync.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant={data.signing_active ? 'success' : 'secondary'}>
                                {data.signing_active ? 'Signing Active' : 'Signing Inactive'}
                            </Badge>
                            <Button asChild variant="outline">
                                <Link href={`/products/${product.id}`}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Product
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
                    {/* Form */}
                    <Card className="py-6">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Product Information</CardTitle>
                                <CardDescription>
                                    Update the details for this product.
                                </CardDescription>
                            </div>
                            <Package className="h-5 w-5 text-emerald-600" />
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
                                        {processing ? 'Updating...' : 'Update Product'}
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
                                    Snapshot of the integration profile.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                        Product
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {data.en_name || 'Product'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {data.ar_name || 'Arabic name pending'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={data.signing_active ? 'success' : 'secondary'}>
                                        {data.signing_active ? 'Signing Active' : 'Signing Inactive'}
                                    </Badge>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {data.signing_active ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                                        <span>{data.signing_active ? 'HMAC required' : 'HMAC disabled'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <LinkIcon className="h-4 w-4" />
                                        <span>{data.callback_url || 'Callback URL pending'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Code className="h-4 w-4" />
                                        <span>{data.invoice_creation_api || 'Invoice API pending'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Key className="h-4 w-4" />
                                        <span>{data.secret_key ? 'Secret key generated' : 'Secret key pending'}</span>
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
