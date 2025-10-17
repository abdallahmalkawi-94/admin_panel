import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Language } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages as LanguagesIcon, Code, ArrowLeftRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Languages',
        href: '/languages',
    },
    {
        title: 'View Language',
        href: '#',
    },
];

interface ShowProps {
    language: Language;
}

export default function Show({ language }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Language - ${language.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Language Details
                        </h1>
                        <p className="text-muted-foreground">
                            View language information
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">
                                    {language.name}
                                </CardTitle>
                                <CardDescription>
                                    {language.name_native}
                                </CardDescription>
                            </div>
                            <Badge variant={language.dir === 'ltr' ? 'secondary' : 'info'}>
                                {language.dir === 'ltr' ? 'LTR' : 'RTL'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>

                                <div className="flex items-start gap-3">
                                    <LanguagesIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Language Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {language.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <LanguagesIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Native Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {language.name_native}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Code className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Language Code
                                        </p>
                                        <Badge variant="outline" className="mt-1 font-mono">
                                            {language.code.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Text Properties
                                </h3>

                                <div className="flex items-start gap-3">
                                    <ArrowLeftRight className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Text Direction
                                        </p>
                                        <div className="mt-1">
                                            <Badge variant={language.dir === 'ltr' ? 'secondary' : 'info'}>
                                                {language.dir === 'ltr'
                                                    ? 'Left-to-Right (LTR)'
                                                    : 'Right-to-Left (RTL)'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border p-4">
                                    <p className="mb-2 text-sm font-medium">
                                        Example Text
                                    </p>
                                    <p
                                        className="text-lg"
                                        dir={language.dir}
                                    >
                                        {language.dir === 'ltr'
                                            ? 'The quick brown fox jumps over the lazy dog.'
                                            : 'مرحبا بك في النظام'}
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

