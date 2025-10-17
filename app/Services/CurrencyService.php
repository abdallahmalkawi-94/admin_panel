<?php

namespace App\Services;

use App\Repositories\CurrencyRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class CurrencyService
{
    protected CurrencyRepository $currencyRepository;

    public function __construct(CurrencyRepository $currencyRepository)
    {
        $this->currencyRepository = $currencyRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->currencyRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->currencyRepository->findById($id);
    }

    public function findByCode(string $code): ?Model
    {
        return $this->currencyRepository->findByCode($code);
    }

    /**
     * Get all currencies (cached)
     */
    public function getAllCurrencies(): Collection
    {
        return $this->currencyRepository->getAllCurrencies();
    }

    /**
     * Get currencies list for dropdowns (cached)
     */
    public function getCurrenciesForDropdown(): array
    {
        return $this->currencyRepository->getCurrenciesForDropdown();
    }

    /**
     * Clear all currency caches
     */
    public function clearCache(): void
    {
        $this->currencyRepository->clearCache();
    }
}

