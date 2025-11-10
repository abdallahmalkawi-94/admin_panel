<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
    protected $fillable = [
        'en_name',
        'ar_name',
        'logo_url',
        'swift_code',
    ];

    /**
     * Get the merchant settings for the bank.
     */
    public function merchantSettings(): HasMany
    {
        return $this->hasMany(MerchantSetting::class);
    }

    /**
     * Scope a query to filter by name.
     */
    public function scopeFilterByName($query, ?string $name)
    {
        if (!empty($name)) {
            return $query
                ->where('en_name', 'like', '%' . $name . '%')
                ->orWhere('ar_name', 'like', '%' . $name . '%');
        }

        return $query;
    }

    /**
     * Scope a query to apply all filters at once.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query->filterByName($filters['name'] ?? null);
    }
}
