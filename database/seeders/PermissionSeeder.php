<?php

namespace Database\Seeders;

use App\Constants\permissions;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = collect(permissions::PERMISSIONS)
            ->flatMap(function ($item) {
                $module = $item['module'];

                return collect($item['permissions'])->map(function ($permission) use ($module) {
                    return [
                        'name' => $permission,
                        'guard_name' => 'web',
                        'module' => $module,
                    ];
                });
            })
            ->values()
            ->toArray();


        Permission::query()->upsert($permissions, ['name']);
    }
}
