<?php

namespace App\Repositories;

use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class BaseRepository
{
    protected Model $model;

    function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get all records with optional pagination.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->applyFilters($filters)
            ->paginate($perPage);
    }

    protected function getModel(): Model
    {
        return $this->model;
    }

    /**
     * Find a record by ID.
     */
    public function findById(int|string $id): ?Model
    {
        return $this->getModel()->newQuery()->find($id);
    }

    /**
     * Create a new record.
     * @throws Exception
     */
    public function create(array $attributes): Model
    {
        return $this->getModel()->newQuery()->create($attributes);
    }

    /**
     * Update a record by ID.
     * @throws Exception
     */
    public function update(array $attributes, int|string $id): ?Model
    {
        $record = $this->getModel()->newQuery()->findOrFail($id);
        $record->update($attributes);
        return $record;
    }

    /**
     * Soft or hard delete a record.
     */
    public function delete(int|string $id, bool $force = false): bool
    {
        $query = $this->getModel()->newQuery()->findOrFail($id);
        return $force ? $query->forceDelete() : $query->delete();
    }

    /**
     * Restore a soft-deleted record.
     */
    public function restore(int|string $id): ?Model
    {
        $record = $this->getModel()->newQuery()->onlyTrashed()->findOrFail($id);
        $record->restore();
        return $record;
    }
}
