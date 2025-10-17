import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Country } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Map, MapPin, Phone } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Countries',
        href: '/countries',
    },
    {
        title: 'View Country',
        href: '#',
    },
];

// Helper function to get badge variant based on status
const getStatusVariant = (
    status: number,
): 'success' | 'destructive' | 'secondary' => {
    switch (status) {
        case 1:
            return 'success'; // Active
        case 0:
            return 'destructive'; // Inactive
        default:
            return 'secondary';
    }
};

interface ShowProps {
    country: Country;
}

export default function Show({ country }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Country - ${country.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Country Details
                        </h1>
                        <p className="text-muted-foreground">
                            View country information and configuration
                        </p>
                    </div>
                </div>

                {/* Country Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div>
                                    <CardTitle className="text-2xl">
                                        {country.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {country.native || country.name}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant={getStatusVariant(country.status)}>
                                {country.status === 1 ? 'Active' : 'Inactive'}
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
                                    <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Country Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {country.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            ISO Codes
                                        </p>
                                        <div className="flex gap-2">
                                            <Badge variant="outline">
                                                ISO2: {country.iso2}
                                            </Badge>
                                            {country.iso3 && (
                                                <Badge variant="outline">
                                                    ISO3: {country.iso3}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Phone Code
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {country.phone_code || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Country ID
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            #{country.id}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Geographic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Geographic Information
                                </h3>

                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Region
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {country.region || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Subregion
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {country.subregion || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Status
                                    </p>
                                    <Badge
                                        variant={getStatusVariant(
                                            country.status,
                                        )}
                                    >
                                        {country.status === 1
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
