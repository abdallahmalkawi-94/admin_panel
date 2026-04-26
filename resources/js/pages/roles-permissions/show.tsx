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
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, IdCard, ShieldCheck, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'View Role',
        href: '#',
    },
];

interface ShowProps {
    role: Role;
    isProtected: boolean;
}

function formatPermissionName(name: string) {
    return name
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function Show({ role, isProtected }: ShowProps) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
            router.delete(`/roles/${role.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Role - ${role.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background">
                                <ShieldCheck className="h-7 w-7 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Role Profile
                                </div>
                                <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                    {role.name}
                                </h1>
                                <p className="text-muted-foreground">
                                    Guard: {role.guard_name}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Button asChild>
                                <Link href={`/roles/${role.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            {!isProtected && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Role ID
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    #{role.id}
                                </p>
                            </div>
                            <IdCard className="h-5 w-5 text-emerald-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Permissions
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {role.permissions?.length || 0}
                                </p>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-sky-600" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center justify-between p-5">
                            <div>
                                <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                    Protection
                                </p>
                                <p className="mt-2 text-sm font-semibold">
                                    {isProtected ? 'Protected' : 'Editable'}
                                </p>
                            </div>
                            <Badge variant={isProtected ? 'dark' : 'secondary'}>
                                {isProtected ? 'SYSTEM' : 'STANDARD'}
                            </Badge>
                        </CardContent>
                    </Card>
                </div>

                <Card className="py-6">
                    <CardHeader>
                        <CardTitle>Assigned Permissions</CardTitle>
                        <CardDescription>
                            Active permissions attached to this role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {role.permissions && role.permissions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {role.permissions.map((permission) => (
                                    <Badge key={permission.id} variant="outline">
                                        {formatPermissionName(permission.name)}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No permissions assigned.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
