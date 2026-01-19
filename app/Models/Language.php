<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Nnjeim\World\Models\Language as WorldLanguage;

class Language extends WorldLanguage
{
    // Cache constants
    const CACHE_KEY_ALL = 'languages:all';

    /**
     * Get all cached languages
     * Usage: Language::cached()
     */
    public static function cached(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY_ALL, function () {
            return self::query()->get();
        });
    }

    /**
     * Get cached languages for dropdown
     * Usage: Language::dropdown()
     */
    public static function dropdown(): array
    {
        return self::cached()
            ->map(fn($language) => [
                'code' => $language->code,
                'name' => $language->name,
                'name_native' => $language->name_native,
            ])
            ->toArray();
    }

    /**
     * Find a language by code from the cached collection.
     * Usage: Language::findByCodeCached('en')
     */
    public static function findByCodeCached(string $code): ?self
    {
        return self::cached()->firstWhere('code', $code);
    }

    /**
     * Clear all language caches
     * Usage: Language::clearCache()
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
    }

    /**
     * Scope a query to filter by name.
     */
    public function scopeFilterByName($query, ?string $name)
    {
        if (!empty($name)) {
            return $query->where('name', 'like', '%' . $name . '%')
                ->orWhere('name_native', 'like', '%' . $name . '%');
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
     * Scope a query to filter by direction.
     */
    public function scopeFilterByDir($query, ?string $dir)
    {
        if (!empty($dir)) {
            return $query->where('dir', $dir);
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
            ->filterByCode($filters['code'] ?? null)
            ->filterByDir($filters['dir'] ?? null);
    }
}
