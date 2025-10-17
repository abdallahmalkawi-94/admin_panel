<?php

namespace App\Models;

use Nnjeim\World\Models\Language as WorldLanguage;

class Language extends WorldLanguage
{
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

