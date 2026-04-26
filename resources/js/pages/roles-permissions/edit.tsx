import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission, type Role } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { type FormEventHandler } from 'react';
import { RoleForm } from './role-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Edit Role',
        href: '#',
    },
];

interface EditProps {
    role: Role;
    permissions: Permission[];
    isProtected: boolean;
}

export default function Edit({ role, permissions }: EditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        name: role.name,
        permissions: role.permission_names || [],
    });

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        patch(`/roles/${role.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Role - ${role.name}`} />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                <Sparkles className="h-4 w-4" />
                                Access Control
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Edit Role
                            </h1>
                            <p className="text-muted-foreground">
                                Update role permissions and access boundaries.
                            </p>
                        </div>
                        <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>

                <RoleForm
                    data={data}
                    errors={errors}
                    permissions={permissions}
                    processing={processing}
                    submitLabel="Save Changes"
                    onSubmit={handleSubmit}
                    onNameChange={(name) => setData('name', name)}
                    onPermissionsChange={(selectedPermissions) =>
                        setData('permissions', selectedPermissions)
                    }
                    nameDisabled={true}
                />
            </div>
        </AppLayout>
    );
}
