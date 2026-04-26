import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, Sparkles } from 'lucide-react';
import { type FormEventHandler } from 'react';
import { RoleForm } from './role-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Create Role',
        href: '/roles/create',
    },
];

interface CreateProps {
    permissions: Permission[];
}

export default function Create({ permissions }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();

        post('/roles', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-500/10 via-amber-400/10 to-sky-500/10 p-6">
                    <div className="pointer-events-none absolute top-6 right-6 hidden h-24 w-24 rounded-full bg-sky-400/20 blur-2xl lg:block" />
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
                                <Sparkles className="h-4 w-4" />
                                Access Setup
                            </div>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                                Create Role
                            </h1>
                            <p className="text-muted-foreground">
                                Add a role and assign the permissions it should carry.
                            </p>
                        </div>
                        <KeyRound className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>

                <RoleForm
                    data={data}
                    errors={errors}
                    permissions={permissions}
                    processing={processing}
                    submitLabel="Create Role"
                    onSubmit={handleSubmit}
                    onNameChange={(name) => setData('name', name)}
                    onPermissionsChange={(selectedPermissions) =>
                        setData('permissions', selectedPermissions)
                    }
                />
            </div>
        </AppLayout>
    );
}
