<?php

namespace App\Http\Controllers;

use App\Constants\roles;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use App\Services\RoleService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Inertia\ResponseFactory;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    private RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|ResponseFactory
    {
        $perPage = $request->input('per_page', 10);
        $filters = $request->only(['name']);

        $cacheVersion = Cache::get('roles.index.version', 1);
        $cacheKey = 'roles.index.v'.$cacheVersion.'.'.md5(json_encode($request->query()));
        $cacheTtlSeconds = 300;

        $payload = Cache::remember($cacheKey, $cacheTtlSeconds, function () use ($perPage, $filters) {
            return [
                'roles' => $this->roleService->paginate($perPage, $filters),
            ];
        });

        return inertia('roles-permissions/index', [
            'roles' => RoleResource::collection($payload['roles']),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response|ResponseFactory
    {
        return inertia('roles-permissions/create', [
            'permissions' => $this->permissionsPayload(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request): RedirectResponse
    {
        try {
            $role = $this->roleService->create($request->validated());
            $this->bumpIndexCache();

            return redirect()
                ->route('roles.show', $role->getAttribute('id'))
                ->with('success', 'Role created successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Failed to create role: '.$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role): Response|ResponseFactory
    {
        $role->load('permissions');

        return inertia('roles-permissions/show', [
            'role' => (new RoleResource($role))->resolve(),
            'isProtected' => $this->isProtected($role),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role): Response|ResponseFactory
    {
        $role->load('permissions');

        return inertia('roles-permissions/edit', [
            'role' => (new RoleResource($role))->resolve(),
            'permissions' => $this->permissionsPayload(),
            'isProtected' => $this->isProtected($role),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role): RedirectResponse
    {
        try {
            $updatedRole = $this->roleService->update($role->id, $request->validated());
            $this->bumpIndexCache();

            return redirect()
                ->route('roles.show', $updatedRole?->getAttribute('id') ?? $role->id)
                ->with('success', 'Role updated successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());

            return back()
                ->withInput()
                ->with('error', 'Failed to update role: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($this->isProtected($role)) {
            return back()->with('error', 'The SYSTEM_ADMIN role cannot be deleted.');
        }

        try {
            $this->roleService->delete($role->id);
            $this->bumpIndexCache();

            return redirect()
                ->route('roles.index')
                ->with('success', 'Role deleted successfully.');
        } catch (Exception $e) {
            logger($e->getMessage());

            return back()->with('error', 'Failed to delete role: '.$e->getMessage());
        }
    }

    private function permissionsPayload(): array
    {
        return $this->roleService
            ->permissions()
            ->map(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'guard_name' => $permission->guard_name,
                'module' => $permission->module,
            ])
            ->values()
            ->all();
    }

    private function isProtected(Role $role): bool
    {
        return $role->name === roles::SYSTEM_ADMIN;
    }

    private function bumpIndexCache(): void
    {
        Cache::forever('roles.index.version', Cache::get('roles.index.version', 1) + 1);
    }
}
