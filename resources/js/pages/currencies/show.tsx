import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Currency } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Globe, Hash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Currencies',
        href: '/currencies',
    },
    {
        title: 'View Currency',
        href: '#',
    },
];

interface ShowProps {
    currency: Currency;
}

export default function Show({ currency }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Currency - ${currency.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Currency Details
                        </h1>
                        <p className="text-muted-foreground">
                            View currency information
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{currency.symbol}</span>
                                <div>
                                    <CardTitle className="text-2xl">
                                        {currency.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {currency.code}
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>

                                <div className="flex items-start gap-3">
                                    <DollarSign className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Currency Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {currency.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Hash className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Currency Code
                                        </p>
                                        <Badge variant="outline" className="mt-1">
                                            {currency.code}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Country
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {currency.country_name || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <DollarSign className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Currency ID
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            #{currency.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Formatting Information
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Symbol</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{currency.symbol}</span>
                                        <span className="text-sm text-muted-foreground">
                                            (Native: {currency.symbol_native})
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Precision</p>
                                    <p className="text-sm text-muted-foreground">
                                        {currency.precision} decimal places
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Symbol Position
                                    </p>
                                    <Badge variant="secondary">
                                        {currency.symbol_first
                                            ? 'Symbol First'
                                            : 'Symbol Last'}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Decimal Mark
                                    </p>
                                    <code className="text-sm">
                                        {currency.decimal_mark}
                                    </code>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Thousands Separator
                                    </p>
                                    <code className="text-sm">
                                        {currency.thousands_separator}
                                    </code>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Example Format
                                    </p>
                                    <p className="text-sm font-mono text-muted-foreground">
                                        {currency.symbol_first
                                            ? `${currency.symbol}1${currency.thousands_separator}234${currency.decimal_mark}56`
                                            : `1${currency.thousands_separator}234${currency.decimal_mark}56${currency.symbol}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

