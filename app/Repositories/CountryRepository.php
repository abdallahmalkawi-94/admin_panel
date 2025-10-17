<?php

namespace App\Repositories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CountryRepository extends BaseRepository
{
    protected Model $model;

    // Cache keys
    const CACHE_KEY_ALL_COUNTRIES = 'countries:all';
    const CACHE_KEY_REGIONS = 'countries:regions';
    const CACHE_KEY_COUNTRY_BY_ISO2 = 'countries:iso2:';
    const CACHE_TTL = 86400; // 24 hours

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
     * Find a country by iso2 code (cached)
     */
    public function findByIso2(string $iso2): ?Model
    {
        return Cache::remember(self::CACHE_KEY_COUNTRY_BY_ISO2 . $iso2, self::CACHE_TTL, function () use ($iso2) {
            return $this->getModel()->newQuery()->where('iso2', $iso2)->first();
        });
    }
}

