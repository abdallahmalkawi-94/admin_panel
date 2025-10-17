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
            router.delete(`/users/${user.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit('/users');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View User - ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            User Details
                        </h1>
                        <p className="text-muted-foreground">
                            View user information and account status
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href="/users">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
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

                {/* User Information Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">
                                    {user.name}
                                </CardTitle>
                                <CardDescription>
                                    {user.email}
                                </CardDescription>
                            </div>
                            <Badge variant={getStatusVariant(user.status_id)}>
                                {user.status.description}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Personal Information
                                </h3>

                                <div className="flex items-start gap-3">
                                    <UserIcon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Full Name
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Email Address
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                        {user.email_verified_at ? (
                                            <Badge
                                                variant="success"
                                                className="mt-1"
                                            >
                                                Verified
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="mt-1"
                                            >
                                                Not Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Mobile Number
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.country_code} {user.mobile_number}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Country
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.country_name || user.country_code}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Account Information
                                </h3>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        Account Status
                                    </p>
                                    <Badge variant={getStatusVariant(user.status_id)}>
                                        {user.status.description}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        User ID
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        #{user.id}
                                    </p>
                                </div>

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
