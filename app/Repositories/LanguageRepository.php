<?php

namespace App\Repositories;

use App\Models\Language;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class LanguageRepository extends BaseRepository
{
    protected Model $model;

    // Cache keys
    const CACHE_KEY_ALL_LANGUAGES = 'languages:all';
    const CACHE_KEY_LANGUAGE_BY_CODE = 'languages:code:';
    const CACHE_TTL = 86400; // 24 hours

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
     * Get all languages (cached)
     */
    public function getAllLanguages(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL_LANGUAGES, self::CACHE_TTL, function () {
            return $this->getModel()->newQuery()
                ->get();
        });
    }

    /**
     * Get languages list for dropdowns (code and name only)
     */
    public function getLanguagesForDropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_ALL_LANGUAGES . ':dropdown', self::CACHE_TTL, function () {
            return $this->getModel()->newQuery()
                ->get(['code', 'name', 'name_native'])
                ->map(function ($language) {
                    return [
                        'code' => $language->code,
                        'name' => $language->name,
                        'name_native' => $language->name_native,
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Find a language by code (cached)
     */
    public function findByCode(string $code): ?Model
    {
        return Cache::remember(self::CACHE_KEY_LANGUAGE_BY_CODE . $code, self::CACHE_TTL, function () use ($code) {
            return $this->getModel()->newQuery()->where('code', $code)->first();
        });
    }

    /**
     * Clear all language caches
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL_LANGUAGES);
        Cache::forget(self::CACHE_KEY_ALL_LANGUAGES . ':dropdown');

        $languages = $this->getModel()->newQuery()->get(['code']);
        foreach ($languages as $language) {
            Cache::forget(self::CACHE_KEY_LANGUAGE_BY_CODE . $language->code);
        }
    }
}

