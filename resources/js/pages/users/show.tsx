import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
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
    Mail,
    MapPin,
    Phone,
    Trash2,
    User as UserIcon,
    Users,
    ShieldCheck,
    CheckCircle2,
    IdCard,
    Earth,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'View User',
        href: '#',
    },
];

// User Status Constants (matching backend)
const USER_STATUS = {
    ACTIVE: 1,
    IN_ACTIVE: 2,
    PENDING_VERIFICATION: 3,
    BLOCKED: 4,
} as const;

// Helper function to get badge variant based on status
const getStatusVariant = (
    statusId: number,
): 'success' | 'dark' | 'info' | 'destructive' | 'secondary' => {
    switch (statusId) {
        case USER_STATUS.ACTIVE:
            return 'success';
        case USER_STATUS.IN_ACTIVE:
            return 'dark';
        case USER_STATUS.PENDING_VERIFICATION:
            return 'info';
        case USER_STATUS.BLOCKED:
            return 'destructive';
        default:
            return 'secondary';
    }
};

interface ShowProps {
    user: User;
}

export default function Show({ user }: ShowProps) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(`/users/${user.id}`);
        }
    };

    const initials = user.name
        ? user.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part.charAt(0))
              .join('')
              .toUpperCase()
        : 'U';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-sky-500/10 via-emerald-400/10 to-amber-400/10 p-6">
                    <div className="pointer-events-none absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-sky-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background text-xl font-semibold">
                                {initials}
                            </div>
                            <div>
                                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    User Profile
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {user.name}
                                </h1>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    {user.email}
                                </p>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    {user.country_code} {user.mobile_number}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={getStatusVariant(user.status_id)}>
                                {user.status.description}
                            </Badge>
                            <Badge variant={user.email_verified_at ? 'success' : 'info'}>
                                {user.email_verified_at ? 'Verified' : 'Pending'}
                            </Badge>
                            <Button asChild variant="outline">
                                <Link href="/users">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/users/${user.id}/edit`}>
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
                                    User ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    #{user.id}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                    Country
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {user.country_name || user.country_code}
                                </p>
                            </div>
                            <MapPin className="h-5 w-5 text-amber-600" />
                        </CardContent>
                    </Card>
                </div>

                {/* User Information Card */}
                <Card className={'py-6'}>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Account Timeline
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Created At
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            user.created_at,
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
                                            user.updated_at,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                                {user.email_verified_at && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">
                                            Email Verified At
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(
                                                user.email_verified_at,
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
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
