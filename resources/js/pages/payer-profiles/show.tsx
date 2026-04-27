import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PayerProfile } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BadgeCheck,
    Building2,
    CalendarClock,
    CircleDollarSign,
    Fingerprint,
    IdCard,
    Mail,
    Package,
    Phone,
    UserRound,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Payer Profiles',
        href: '/payer-profiles',
    },
    {
        title: 'View Payer Profile',
        href: '#',
    },
];

const PAYER_PROFILE_STATUS = {
    ACTIVE: 1,
    INACTIVE: 2,
    PENDING: 3,
    SUSPENDED: 4,
} as const;

interface ShowProps {
    payerProfile: PayerProfile;
}

const getStatusLabel = (status: number) => {
    switch (status) {
        case PAYER_PROFILE_STATUS.ACTIVE:
            return 'Active';
        case PAYER_PROFILE_STATUS.INACTIVE:
            return 'Inactive';
        case PAYER_PROFILE_STATUS.PENDING:
            return 'Pending';
        case PAYER_PROFILE_STATUS.SUSPENDED:
            return 'Suspended';
        default:
            return `Status ${status}`;
    }
};

const getStatusVariant = (
    status: number,
): 'success' | 'dark' | 'info' | 'destructive' | 'secondary' => {
    switch (status) {
        case PAYER_PROFILE_STATUS.ACTIVE:
            return 'success';
        case PAYER_PROFILE_STATUS.INACTIVE:
            return 'dark';
        case PAYER_PROFILE_STATUS.PENDING:
            return 'info';
        case PAYER_PROFILE_STATUS.SUSPENDED:
            return 'destructive';
        default:
            return 'secondary';
    }
};

const formatDate = (value?: string | null) => {
    if (!value) {
        return 'N/A';
    }

    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

function DetailItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof UserRound;
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div className="flex items-start gap-3">
            <Icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm break-words text-muted-foreground">
                    {value || 'N/A'}
                </p>
            </div>
        </div>
    );
}

export default function Show({ payerProfile }: ShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payer Profile - ${payerProfile.full_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
                                <UserRound className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Payer Profile
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {payerProfile.full_name}
                                </h1>
                            </div>
                        </div>
                        <Badge
                            variant={getStatusVariant(
                                payerProfile.status,
                            )}
                        >
                            {getStatusLabel(payerProfile.status)}
                        </Badge>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Profile ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    #{payerProfile.id}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Referral ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {payerProfile.referral_id}
                                </p>
                            </div>
                            <Fingerprint className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Total Points
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {payerProfile.total_points}
                                </p>
                            </div>
                            <CircleDollarSign className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Contact and Account</CardTitle>
                        <CardDescription>
                            Payer account and contact information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <DetailItem
                                icon={UserRound}
                                label="Full Name"
                                value={payerProfile.full_name}
                            />
                            <DetailItem
                                icon={UserRound}
                                label="Username"
                                value={payerProfile.username}
                            />
                            <DetailItem
                                icon={Mail}
                                label="Email"
                                value={payerProfile.email}
                            />
                            <DetailItem
                                icon={Phone}
                                label="Mobile Number"
                                value={payerProfile.mobile_number}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Product and Merchant</CardTitle>
                        <CardDescription>
                            Linked product and merchant context
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <DetailItem
                                icon={Package}
                                label="Product"
                                value={payerProfile.product?.en_name}
                            />
                            <DetailItem
                                icon={Building2}
                                label="Merchant"
                                value={payerProfile.merchant?.en_name}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Identity Details</CardTitle>
                        <CardDescription>
                            Stored payer identity reference
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <DetailItem
                                icon={IdCard}
                                label="Identity Number"
                                value={payerProfile.identity_no}
                            />
                            <DetailItem
                                icon={Fingerprint}
                                label="Identity Type ID"
                                value={payerProfile.identity_type_id}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Timestamps</CardTitle>
                        <CardDescription>
                            Profile creation and update information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <DetailItem
                                icon={CalendarClock}
                                label="Created At"
                                value={formatDate(payerProfile.created_at)}
                            />
                            <DetailItem
                                icon={CalendarClock}
                                label="Last Updated"
                                value={formatDate(payerProfile.updated_at)}
                            />
                            {payerProfile.deleted_at && (
                                <DetailItem
                                    icon={CalendarClock}
                                    label="Deleted At"
                                    value={formatDate(payerProfile.deleted_at)}
                                />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
