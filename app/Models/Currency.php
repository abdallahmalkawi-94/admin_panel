<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;
use Nnjeim\World\Models\Currency as WorldCurrency;

class Currency extends WorldCurrency
{
    // Cache constants
    const CACHE_KEY_ALL = 'currencies:all';
    const CACHE_KEY_DROPDOWN = 'currencies:all:dropdown';
    const CACHE_TTL = 86400; // 24 hours

    /**
     * Get all cached currencies
     * Usage: Currency::cached()
     */
    public static function cached(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return self::query()->get();
        });
    }

    /**
     * Get cached currencies for dropdown
     * Usage: Currency::dropdown()
     */
    public static function dropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL, function () {
            return self::query()
                ->get(['code', 'name', 'symbol'])
                ->groupBy('code')
                ->map(fn($currency) => [
                    'code' => $currency->first()->code,
                    'name' => $currency->first()->name,
                    'symbol' => $currency->first()->symbol,
                ])
                ->values()
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
     * Clear all currency caches
     * Usage: Currency::clearCache()
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
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
     * Scope a query to filter by code.
     */
    public function scopeFilterByCode($query, ?string $code)
    {
        if (!empty($code)) {
            return $query->where('code', 'like', '%' . $code . '%');
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
            ->filterByCode($filters['code'] ?? null);
    }
}


