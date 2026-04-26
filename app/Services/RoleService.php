<?php

namespace App\Services;

use App\Repositories\RoleRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleService
{
    protected RoleRepository $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->roleRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->roleRepository->findById($id);
    }

    public function findWithPermissions($id): Collection|Model
    {
        return $this->roleRepository->findWithPermissions($id);
    }

    public function permissions(): Collection
    {
        return $this->roleRepository->allPermissions();
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            $permissions = $data['permissions'] ?? [];
            unset($data['permissions']);

            $role = $this->roleRepository->create([
                ...$data,
                'guard_name' => 'web',
            ]);

            $role->syncPermissions($permissions);

            return $role->load('permissions');
        });
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return DB::transaction(function () use ($id, $data) {
            $permissions = $data['permissions'] ?? [];
            unset($data['permissions']);

            $role = $this->roleRepository->update($data, $id);
            $role?->syncPermissions($permissions);

            return $role?->load('permissions');
        });
    }

    public function delete($id, $force = false): bool
    {
        return $this->roleRepository->delete($id, $force);
    }
}
