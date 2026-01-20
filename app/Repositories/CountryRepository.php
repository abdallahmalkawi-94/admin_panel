<?php

namespace App\Repositories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class CountryRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Country $country)
    {
        parent::__construct($country);
    }

    /**
     * Get all countries with pagination and filters.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->applyFilters($filters)
            ->paginate($perPage);
    }

    /**
     * Find a country by iso2 code.
     */
    public function findByIso2(string $iso2): ?Model
    {
        return Country::findByIso2Cached($iso2);
    }
}
