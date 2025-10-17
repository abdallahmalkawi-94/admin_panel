<?php

namespace App\Repositories;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class CurrencyRepository extends BaseRepository
{
    protected Model $model;

    // Cache keys
    const CACHE_KEY_ALL_CURRENCIES = 'currencies:all';
    const CACHE_KEY_CURRENCY_BY_CODE = 'currencies:code:';
    const CACHE_TTL = 86400; // 24 hours

    public function __construct(Currency $currency)
    {
        parent::__construct($currency);
    }

    /**
     * Get all currencies with pagination and filters.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->with(['country'])
            ->applyFilters($filters)
            ->paginate($perPage);
    }

    /**
     * Get all currencies (cached)
     */
    public function getAllCurrencies(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL_CURRENCIES, self::CACHE_TTL, function () {
            return $this->getModel()->newQuery()
                ->get();
        });
    }

    /**
     * Get currencies list for dropdowns (code and name only)
     */
    public function getCurrenciesForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_ALL_CURRENCIES . ':dropdown', self::CACHE_TTL, function () {
            return $this->getModel()->newQuery()
                ->get(['code', 'name', 'symbol'])
                ->map(function ($currency) {
                    return [
                        'code' => $currency->code,
                        'name' => $currency->name,
                        'symbol' => $currency->symbol,
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Find a currency by code (cached)
     */
    public function findByCode(string $code): ?Model
    {
        return Cache::remember(self::CACHE_KEY_CURRENCY_BY_CODE . $code, self::CACHE_TTL, function () use ($code) {
            return $this->getModel()->newQuery()->where('code', $code)->first();
        });
    }

    /**
     * Clear all currency caches
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL_CURRENCIES);
        Cache::forget(self::CACHE_KEY_ALL_CURRENCIES . ':dropdown');

        $currencies = $this->getModel()->newQuery()->get(['code']);
        foreach ($currencies as $currency) {
            Cache::forget(self::CACHE_KEY_CURRENCY_BY_CODE . $currency->code);
        }
    }
}

