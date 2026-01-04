<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class Bank extends Model
{
    protected $fillable = [
        'en_name',
        'ar_name',
        'logo_url',
        'swift_code',
    ];

    // Cache constants
    const CACHE_KEY_ALL = 'banks:all';
    const CACHE_KEY_DROPDOWN = 'banks:dropdown';
    const CACHE_TTL = 86400; // 24 hours

    /**
     * Get cached merchant statuses for dropdown
     * Usage: Bank::dropdown()
     */
    public static function dropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL, function () {
            return Bank::query()
                ->get(['id', 'en_name', 'ar_name'])
                ->map(fn($bank) => [
                    'id' => $bank->id,
                    'en_name' => $bank->en_name,
                    'ar_name' => $bank->ar_name,
                ])
                ->toArray();
        });
    }

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
