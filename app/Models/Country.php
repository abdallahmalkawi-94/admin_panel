<?php

namespace App\Models;

use Nnjeim\World\Models\Country as WorldCountry;

class Country extends WorldCountry
{
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

