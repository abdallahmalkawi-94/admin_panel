<?php

namespace App\Services;

use App\Models\Language;
use App\Repositories\LanguageRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class LanguageService
{
    protected LanguageRepository $languageRepository;

    public function __construct(LanguageRepository $languageRepository)
    {
        $this->languageRepository = $languageRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->languageRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->languageRepository->findById($id);
    }

    public function findByCode(string $code): ?Model
    {
        return $this->languageRepository->findByCode($code);
    }

    /**
     * Get all languages (cached)
     */
    public function getAllLanguages(): Collection
    {
        return $this->languageRepository->getAllLanguages();
    }

    /**
     * Get languages list for dropdowns (cached)
     */
    public function getLanguagesForDropdown(): array
    {
        return $this->languageRepository->getLanguagesForDropdown();
    }

    /**
     * Clear all language caches
     */
    public function clearCache(): void
    {
        Language::clearCache();
    }
}
