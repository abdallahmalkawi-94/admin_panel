<?php

namespace Database\Seeders;

use App\Constants\roles;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = collect(roles::ROLES)->map(function ($item) {
            return [
                'name' => $item,
                'guard_name' => 'web'
            ];
        })->toArray();

        Role::query()->upsert($roles, ['name']);
    }
}
