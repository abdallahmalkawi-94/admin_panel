import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Permission } from '@/types';
import { ChevronDown, Save, ShieldCheck } from 'lucide-react';
import { type FormEventHandler, useState } from 'react';

interface RoleFormProps {
    data: {
        name: string;
        permissions: string[];
    };
    errors: Partial<Record<'name' | 'permissions', string>> &
        Record<string, string | undefined>;
    permissions: Permission[];
    processing: boolean;
    submitLabel: string;
    onSubmit: FormEventHandler;
    onNameChange: (name: string) => void;
    onPermissionsChange: (permissions: string[]) => void;
    nameDisabled?: boolean;
}

function groupPermissions(permissions: Permission[]) {
    return permissions.reduce<Record<string, Permission[]>>(
        (groups, permission) => {
            const moduleName =
                permission.module.replace('App\\Models\\', '') + ' Module';

            groups[moduleName] = groups[moduleName] || [];
            groups[moduleName].push(permission);

            return groups;
        },
        {},
    );
}

function formatPermissionName(name: string) {
    return name
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export function RoleForm({
    data,
    errors,
    permissions,
    processing,
    submitLabel,
    onSubmit,
    onNameChange,
    onPermissionsChange,
    nameDisabled = false,
}: RoleFormProps) {
    const groupedPermissions = groupPermissions(permissions);
    const [openCards, setOpenCards] = useState<Record<string, boolean>>({});
    const allPermissionNames = permissions.map((permission) => permission.name);
    const selectedPermissionNames = new Set(data.permissions);
    const selectedCount = allPermissionNames.filter((permissionName) =>
        selectedPermissionNames.has(permissionName),
    ).length;
    console.log(permissions.length);
    console.log(selectedCount);
    console.log(allPermissionNames.length);
    const allPermissionsSelected = allPermissionNames.length === 0 && selectedCount === allPermissionNames.length;
    const noPermissionsSelected = selectedCount === 0;
    const selectAllChecked = allPermissionsSelected ? true : noPermissionsSelected ? false : 'indeterminate';

    const togglePermission = (permissionName: string, checked: boolean) => {
        if (checked) {
            onPermissionsChange(
                data.permissions.includes(permissionName)
                    ? data.permissions
                    : [...data.permissions, permissionName],
            );
            return;
        }

        onPermissionsChange(
            data.permissions.filter((name) => name !== permissionName),
        );
    };

    const toggleAllPermissions = (checked: boolean) => {
        onPermissionsChange(checked ? allPermissionNames : []);
    };

    const toggleModulePermissions = (
        modulePermissions: Permission[],
        checked: boolean,
    ) => {
        const modulePermissionNames = modulePermissions.map(
            (permission) => permission.name,
        );

        if (checked) {
            onPermissionsChange(
                Array.from(
                    new Set([...data.permissions, ...modulePermissionNames]),
                ),
            );
            return;
        }

        onPermissionsChange(
            data.permissions.filter(
                (permissionName) =>
                    !modulePermissionNames.includes(permissionName),
            ),
        );
    };

    const getModuleCheckedState = (modulePermissions: Permission[]) => {
        const modulePermissionNames = modulePermissions.map(
            (permission) => permission.name,
        );
        const moduleSelectedCount = modulePermissionNames.filter(
            (permissionName) => selectedPermissionNames.has(permissionName),
        ).length;

        if (
            modulePermissionNames.length > 0 &&
            moduleSelectedCount === modulePermissionNames.length
        ) {
            return true;
        }

        return moduleSelectedCount === 0 ? false : 'indeterminate';
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <Card className="py-6">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                        <CardTitle>Role Information</CardTitle>
                        <CardDescription>
                            Define the role identity and assigned permissions.
                        </CardDescription>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Role Name{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            disabled={nameDisabled}
                            onChange={(event) =>
                                onNameChange(event.target.value)
                            }
                            placeholder="OPERATIONS_MANAGER"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="py-6">
                <CardHeader>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>
                                Choose what this role can access.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={selectAllChecked}
                                    onCheckedChange={(checked) =>
                                        toggleAllPermissions(checked === true)
                                    }
                                />
                                <span>Select all permissions</span>
                            </label>
                            <Badge variant="secondary">
                                {data.permissions.length} selected
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {Object.entries(groupedPermissions).map(
                        ([groupName, groupPermissions]) => {
                            const isOpen = openCards[groupName] ?? false;
                            return (
                                <Collapsible
                                    key={groupName}
                                    open={isOpen}
                                    onOpenChange={(open) =>
                                        setOpenCards((prev) => ({
                                            ...prev,
                                            [groupName]: open,
                                        }))
                                    }
                                >
                                    <Card className="py-6">
                                        <CardHeader>
                                            <CollapsibleTrigger asChild>
                                                <div className="flex cursor-pointer items-center justify-between">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div
                                                            onClick={(event) =>
                                                                event.stopPropagation()
                                                            }
                                                            onKeyDown={(
                                                                event,
                                                            ) =>
                                                                event.stopPropagation()
                                                            }
                                                        >
                                                            <Checkbox
                                                                checked={getModuleCheckedState(
                                                                    groupPermissions,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    toggleModulePermissions(
                                                                        groupPermissions,
                                                                        checked ===
                                                                            true,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <CardTitle className="text-sm font-semibold capitalize">
                                                            {groupName}
                                                        </CardTitle>
                                                        <Badge variant="outline">
                                                            {
                                                                groupPermissions.filter(
                                                                    (
                                                                        permission,
                                                                    ) =>
                                                                        data.permissions.includes(
                                                                            permission.name,
                                                                        ),
                                                                ).length
                                                            }
                                                            /
                                                            {
                                                                groupPermissions.length
                                                            }
                                                        </Badge>
                                                    </div>
                                                    <ChevronDown
                                                        className={`h-5 w-5 transition-transform duration-200 ${
                                                            isOpen
                                                                ? 'rotate-180 transform'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                            </CollapsibleTrigger>
                                        </CardHeader>
                                        <CollapsibleContent>
                                            <CardContent className="space-y-6">
                                                <div
                                                    key={groupName}
                                                    className="rounded-lg border p-4"
                                                >
                                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                        {groupPermissions.map(
                                                            (permission) => (
                                                                <label
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="flex min-h-10 items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm"
                                                                >
                                                                    <Checkbox
                                                                        checked={data.permissions.includes(
                                                                            permission.name,
                                                                        )}
                                                                        onCheckedChange={(
                                                                            checked,
                                                                        ) =>
                                                                            togglePermission(
                                                                                permission.name,
                                                                                checked ===
                                                                                    true,
                                                                            )
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {formatPermissionName(
                                                                            permission.name,
                                                                        )}
                                                                    </span>
                                                                </label>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            );
                        },
                    )}
                    {errors.permissions && (
                        <p className="text-sm text-destructive">
                            {errors.permissions}
                        </p>
                    )}
                </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
