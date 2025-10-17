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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Product Details
                        </h1>
                        <p className="text-muted-foreground">
                            View product information and configuration
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/products">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Products
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
                            className={"cursor-pointer"}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Product Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">
                                    {product.en_name}
                                </CardTitle>
                                <CardDescription>
                                    {product.ar_name}
                                </CardDescription>
                            </div>
                            <Badge
                                variant={
                                    product.signing_active
                                        ? 'success'
                                        : 'secondary'
                                }
                            >
                                {product.signing_active
                                    ? 'Signing Active'
                                    : 'Signing Inactive'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>

                                <div className="flex items-start gap-3">
                                    <Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            English Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.en_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Arabic Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {product.ar_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Activity className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Signing Status
                                        </p>
                                        <Badge
                                            variant={
                                                product.signing_active
                                                    ? 'success'
                                                    : 'secondary'
                                            }
                                            className="mt-1"
                                        >
                                            {product.signing_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Package className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Product ID
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            #{product.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* API Configuration */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    API Configuration
                                </h3>

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
                        </div>
                    </CardContent>
                </Card>

                {/* Security Credentials Card */}
                <Card>
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
                <Card>
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
