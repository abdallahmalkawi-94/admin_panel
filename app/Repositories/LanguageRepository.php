<?php

namespace App\Repositories;

use App\Models\Language;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class LanguageRepository extends BaseRepository
{
    protected Model $model;

    public function __construct(Language $language)
    {
        parent::__construct($language);
    }

    /**
     * Get all languages with pagination and filters.
     */
    public function paginate(int $perPage = 15, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->getModel()->newQuery()
            ->applyFilters($filters)
            ->paginate($perPage);
    }

    /**
     * Get all languages (cached).
     */
    public function getAllLanguages(): Collection
    {
        return Language::cached();
    }

    /**
     * Get languages list for dropdowns (code and name only, cached).
     */
    public function getLanguagesForDropdown(): array
    {
        return Language::dropdown();
    }

    /**
     * Find a language by code.
     */
    public function findByCode(string $code): ?Model
    {
        return Language::findByCodeCached($code);
    }
}
