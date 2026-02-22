import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Product } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    Link as LinkIcon,
    Key,
    Activity,
    Code,
    Sparkles,
    ShieldCheck,
    ShieldOff,
    IdCard,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'View Product',
        href: '#',
    },
];

interface ShowProps {
    product: Product;
}

export default function Show({ product }: ShowProps) {
    const handleDelete = () => {
        if (
            confirm(
                `Are you sure you want to delete product "${product.en_name}"?`,
            )
        ) {
            router.delete(`/products/${product.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Product - ${product.en_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
                                <Package className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Product Profile
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {product.en_name}
                                </h1>
                                <p className="text-muted-foreground">
                                    {product.ar_name || 'Arabic name not set'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button asChild variant="outline">
                                <Link href="/products">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/products/${product.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDelete}
                                variant="destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Product ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    #{product.id}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Signing Status
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {product.signing_active ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            {product.signing_active ? (
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            ) : (
                                <ShieldOff className="h-5 w-5 text-amber-600" />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Product Information Card */}
                <Card className="py-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">
                                    API Configuration
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 grid-cols-2">
                            {/* API Configuration */}
                            <div className="flex items-start gap-3">
                                <LinkIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        Callback URL
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {product.callback_url || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <LinkIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        Webhook URL
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {product.webhook_url || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Code className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        Invoice Inquiry API
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {product.invoice_inquiry_api ||
                                            'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Code className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        Invoice Creation API
                                    </p>
                                    <p className="truncate text-sm text-muted-foreground">
                                        {product.invoice_creation_api ||
                                            'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Credentials Card */}
                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Security Credentials</CardTitle>
                        <CardDescription>
                            API keys and security configuration
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <Key className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        HMAC Key
                                    </p>
                                    <p className="truncate font-mono text-sm text-muted-foreground">
                                        {product.hmac_key
                                            ? '••••••••••••'
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Key className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        Token Key
                                    </p>
                                    <p className="truncate font-mono text-sm text-muted-foreground">
                                        {product.token_key
                                            ? '••••••••••••'
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Key className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium">
                                        Secret Key
                                    </p>
                                    <p className="truncate font-mono text-sm text-muted-foreground">
                                        {product.secret_key}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timestamps Card */}
                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Timestamps</CardTitle>
                        <CardDescription>
                            Product creation and update information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Created At
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(
                                        product.created_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Last Updated
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(
                                        product.updated_at,
                                    ).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>

                            {product.deleted_at && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Deleted At
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            product.deleted_at,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
