<?php

namespace App\Repositories;

use App\Models\Bank;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class BankRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Bank $bank) {
        parent::__construct($bank);
    }

    /**
     * Get all banks with pagination.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->applyFilters($filters)
            ->paginate($perPage);
    }
}

