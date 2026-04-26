<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()
            ->newQuery()
            ->withCount('permissions')
            ->when($filters['name'] ?? null, function ($query, string $name) {
                $query->where('name', 'like', '%'.$name.'%');
            })
            ->paginate($perPage);
    }

    public function findWithPermissions(int|string $id): Collection|Model
    {
        return $this->getModel()
            ->newQuery()
            ->with('permissions')
            ->find($id);
    }

    public function allPermissions(): Collection
    {
        return Permission::query()
            ->orderBy('name')
            ->get(['id', 'name', 'guard_name', 'module']);
    }
}
