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
     * Get all countries (cached) - used for dropdowns
     */
    public function getAllCountries(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL_COUNTRIES, self::CACHE_TTL, function () {
            return $this->getModel()->newQuery()
                ->where('status', 1) // Only active countries
                ->get(['id', 'iso2', 'iso3', 'name', 'phone_code', 'region', 'subregion', 'status']);
        });
    }

    /**
     * Get countries list for dropdowns (iso2 and name only)
     */
    public function getCountriesForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_ALL_COUNTRIES . ':dropdown', self::CACHE_TTL, function () {
            return $this->getModel()->newQuery()
                ->where('status', 1)
                ->get(['iso2', 'name'])
                ->map(function ($country) {
                    return [
                        'code' => $country->iso2,
                        'name' => $country->name,
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Get distinct regions from countries (cached)
     */
    public function getDistinctRegions(): array
    {
        return Cache::remember(self::CACHE_KEY_REGIONS, self::CACHE_TTL, function () {
            return DB::table('countries')
                ->select('region')
                ->distinct()
                ->whereNotNull('region')
                ->where('region', '!=', '')
                ->where('status', 1)
                ->get()
                ->pluck('region')
                ->toArray();
        });
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

    /**
     * Clear all country caches
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL_COUNTRIES);
        Cache::forget(self::CACHE_KEY_ALL_COUNTRIES . ':dropdown');
        Cache::forget(self::CACHE_KEY_REGIONS);

        // Clear all iso2 caches (this is a simple approach, could be optimized)
        $countries = $this->getModel()->newQuery()->get(['iso2']);
        foreach ($countries as $country) {
            Cache::forget(self::CACHE_KEY_COUNTRY_BY_ISO2 . $country->iso2);
        }
    }

    /**
     * Clear cache for a specific country
     */
    public function clearCountryCache(string $iso2): void
    {
        Cache::forget(self::CACHE_KEY_COUNTRY_BY_ISO2 . $iso2);
        // Also clear the main caches as the list has changed
        Cache::forget(self::CACHE_KEY_ALL_COUNTRIES);
        Cache::forget(self::CACHE_KEY_ALL_COUNTRIES . ':dropdown');
        Cache::forget(self::CACHE_KEY_REGIONS);
    }
}

