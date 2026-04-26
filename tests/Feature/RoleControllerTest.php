<?php

namespace Tests\Feature;

use App\Constants\roles;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        DB::table('user_statuses')->insert([
            'id' => 1,
            'description' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->actingAs($this->createVerifiedUser());
    }

    public function test_authenticated_user_can_view_roles_index(): void
    {
        Role::query()->create(['name' => 'SUPPORT', 'guard_name' => 'web']);

        $response = $this->get(route('roles.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('roles-permissions/index')
            ->has('roles.data', 1)
            ->where('roles.data.0.name', 'SUPPORT')
        );
    }

    public function test_it_creates_a_role_with_default_guard_and_permissions(): void
    {
        $permissions = $this->createPermissions(['show_users', 'add_user']);

        $response = $this->post(route('roles.store'), [
            'name' => 'USER_MANAGER',
            'permissions' => $permissions->pluck('name')->all(),
        ]);

        $role = Role::query()->where('name', 'USER_MANAGER')->firstOrFail();

        $response->assertRedirect(route('roles.show', $role));
        $response->assertSessionHas('success');
        $this->assertSame('web', $role->guard_name);
        $this->assertSameCanonicalizing(
            ['show_users', 'add_user'],
            $role->permissions()->pluck('name')->all(),
        );
    }

    public function test_it_updates_a_role_and_syncs_permissions(): void
    {
        $permissions = $this->createPermissions(['show_users', 'add_user', 'edit_user']);
        $role = Role::query()->create(['name' => 'USER_MANAGER', 'guard_name' => 'web']);
        $role->syncPermissions([$permissions[0]->name, $permissions[1]->name]);

        $response = $this->patch(route('roles.update', $role), [
            'name' => 'USER_ADMIN',
            'permissions' => [$permissions[2]->name],
        ]);

        $role->refresh();

        $response->assertRedirect(route('roles.show', $role));
        $response->assertSessionHas('success');
        $this->assertSame('USER_ADMIN', $role->name);
        $this->assertSame(['edit_user'], $role->permissions()->pluck('name')->all());
    }

    public function test_it_shows_a_role_with_permissions(): void
    {
        $permissions = $this->createPermissions(['show_users']);
        $role = Role::query()->create(['name' => 'VIEWER', 'guard_name' => 'web']);
        $role->syncPermissions($permissions->pluck('name')->all());

        $response = $this->get(route('roles.show', $role));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('roles-permissions/show')
            ->where('role.name', 'VIEWER')
            ->where('role.permissions.0.name', 'show_users')
        );
    }

    public function test_it_deletes_a_normal_role(): void
    {
        $role = Role::query()->create(['name' => 'TEMP_ROLE', 'guard_name' => 'web']);

        $response = $this->delete(route('roles.destroy', $role));

        $response->assertRedirect(route('roles.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    public function test_system_admin_cannot_be_deleted(): void
    {
        $role = Role::query()->create(['name' => roles::SYSTEM_ADMIN, 'guard_name' => 'web']);

        $response = $this
            ->from(route('roles.show', $role))
            ->delete(route('roles.destroy', $role));

        $response->assertRedirect(route('roles.show', $role));
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }

    public function test_system_admin_cannot_be_renamed_but_permissions_can_change(): void
    {
        $permissions = $this->createPermissions(['show_users', 'add_user']);
        $role = Role::query()->create(['name' => roles::SYSTEM_ADMIN, 'guard_name' => 'web']);
        $role->syncPermissions([$permissions[0]->name]);

        $renameResponse = $this
            ->from(route('roles.edit', $role))
            ->patch(route('roles.update', $role), [
                'name' => 'RENAMED_ADMIN',
                'permissions' => [$permissions[1]->name],
            ]);

        $renameResponse->assertRedirect(route('roles.edit', $role));
        $renameResponse->assertSessionHasErrors('name');
        $this->assertDatabaseHas('roles', [
            'id' => $role->id,
            'name' => roles::SYSTEM_ADMIN,
        ]);

        $permissionResponse = $this->patch(route('roles.update', $role), [
            'name' => roles::SYSTEM_ADMIN,
            'permissions' => [$permissions[1]->name],
        ]);

        $permissionResponse->assertRedirect(route('roles.show', $role));
        $this->assertSame(['add_user'], $role->fresh()->permissions()->pluck('name')->all());
    }

    public function test_it_rejects_invalid_permission_names(): void
    {
        $response = $this
            ->from(route('roles.create'))
            ->post(route('roles.store'), [
                'name' => 'BROKEN_ROLE',
                'permissions' => ['missing_permission'],
            ]);

        $response->assertRedirect(route('roles.create'));
        $response->assertSessionHasErrors('permissions.0');
        $this->assertDatabaseMissing('roles', ['name' => 'BROKEN_ROLE']);
    }

    private function createVerifiedUser(): User
    {
        return User::query()->create([
            'name' => 'Role Test User',
            'email' => 'role-test-'.Str::lower(Str::random(10)).'@example.com',
            'password' => Hash::make('password'),
            'mobile_number' => '079'.random_int(1000000, 9999999),
            'status_id' => 1,
            'email_verified_at' => now(),
        ]);
    }

    private function createPermissions(array $names)
    {
        return collect($names)->map(fn (string $name) => Permission::query()->create([
            'name' => $name,
            'guard_name' => 'web',
        ]));
    }
}
