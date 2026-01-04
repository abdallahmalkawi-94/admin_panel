<?php

namespace App\Repositories;

use App\Models\Psp;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class PspRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Psp $model) {
        parent::__construct($model);
    }

    /**
     * Get all PSPs with pagination and eager load relationships.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        $query = $this->getModel()->newQuery()
            ->with(['status', 'country', 'settlementCurrency']);

        // Apply filters
        if (!empty($filters['name'])) {
            $query->where('name', 'LIKE', '%' . $filters['name'] . '%');
        }

        if (!empty($filters['code'])) {
            $query->where('code', 'LIKE', '%' . $filters['code'] . '%');
        }

        if (!empty($filters['country_id'])) {
            $query->where('country_id', $filters['country_id']);
        }

        if (!empty($filters['psp_status_id'])) {
            $query->where('psp_status_id', $filters['psp_status_id']);
        }

        return $query->paginate($perPage);
    }
}