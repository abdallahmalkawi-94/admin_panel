<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Nnjeim\World\Models\Country as WorldCountry;

class Country extends WorldCountry
{
    // Cache constants
    const CACHE_KEY_ALL = 'countries:all';
    const CACHE_KEY_DROPDOWN = 'countries:all:dropdown';
    const CACHE_KEY_REGIONS = 'countries:regions';
    const CACHE_TTL = 86400; // 24 hours

    /**
     * Get all cached countries
     * Usage: Country::cached()
     */
    public static function cached(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return self::query()
                ->where('status', 1)
                ->orderBy('name')
                ->get(['id', 'iso2', 'iso3', 'name', 'phone_code', 'region', 'subregion', 'status']);
        });
    }

    /**
     * Get cached countries for dropdown
     * Usage: Country::dropdown()
     */
    public static function dropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL, function () {
            return self::query()
                ->where('status', 1)
                ->orderBy('name')
                ->get(['iso2', 'name'])
                ->map(fn($country) => [
                    'code' => $country->iso2,
                    'name' => $country->name,
                ])
                ->toArray();
        });
    }

    /**
     * Get cached distinct regions
     * Usage: Country::regions()
     */
    public static function regions(): array
    {
        return Cache::remember(self::CACHE_KEY_REGIONS, self::CACHE_TTL, function () {
            return self::query()
                ->select('region')
                ->distinct()
                ->whereNotNull('region')
                ->where('region', '!=', '')
                ->where('status', 1)
                ->orderBy('region')
                ->pluck('region')
                ->toArray();
        });
    }

    /**
     * Get the merchant settings for the terms and condition.
     */
    public function merchantSettings(): HasMany
    {
        return $this->hasMany(MerchantSetting::class);
    }

    /**
     * Clear all country caches
     * Usage: Country::clearCache()
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
        Cache::forget(self::CACHE_KEY_REGIONS);
    }

    /**
     * Scope a query to filter by name.
     */
    public function scopeFilterByName($query, ?string $name)
    {
        if (!empty($name)) {
            return $query->where('name', 'like', '%' . $name . '%');
        }
        return $query;
    }

    /**
     * Scope a query to filter by region.
     */
    public function scopeFilterByRegion($query, ?string $region)
    {
        if (!empty($region)) {
            return $query->where('region', $region);
        }
        return $query;
    }

    /**
     * Scope a query to filter by iso2 code.
     */
    public function scopeFilterByIso2($query, ?string $iso2)
    {
        if (!empty($iso2)) {
            return $query->where('iso2', $iso2);
        }
        return $query;
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeFilterByStatus($query, ?int $status)
    {
        if (!is_null($status)) {
            return $query->where('status', $status);
        }
        return $query;
    }

    /**
     * Scope a query to apply all filters at once.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query
            ->filterByName($filters['name'] ?? null)
            ->filterByRegion($filters['region'] ?? null)
            ->filterByIso2($filters['iso2'] ?? null)
            ->filterByStatus($filters['status'] ?? null);
    }
}


