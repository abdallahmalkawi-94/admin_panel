<?php

namespace App\Repositories;

use App\Models\Currency;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class CurrencyRepository extends BaseRepository
{
    protected Model $model;

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
     * Get all currencies (cached).
     */
    public function getAllCurrencies(): Collection
    {
        return Currency::cached();
    }

    /**
     * Get currencies list for dropdowns (code and name only, cached).
     */
    public function getCurrenciesForDropdown(): array
    {
        return Currency::dropdown();
    }

    /**
     * Find a currency by code.
     */
    public function findByCode(string $code): ?Model
    {
        return Currency::findByCodeCached($code);
    }
}
