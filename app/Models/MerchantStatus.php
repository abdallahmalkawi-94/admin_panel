<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class MerchantStatus extends Model
{
    protected $fillable = [
        'description',
    ];

    // Cache constants
    const CACHE_KEY_ALL = 'merchant_statuses:all';
    const CACHE_KEY_DROPDOWN = 'merchant_statuses:all:dropdown';
    const CACHE_TTL = 86400; // 24 hours

    /**
     * Get all cached merchant statuses
     * Usage: MerchantStatus::cached()
     */
    public static function cached(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return self::query()->get(['id', 'description']);
        });
    }

    /**
     * Get cached merchant statuses for dropdown
     * Usage: MerchantStatus::dropdown()
     */
    public static function dropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL, function () {
            return self::query()
                ->get(['id', 'description'])
                ->map(fn($status) => [
                    'id' => $status->id,
                    'description' => $status->description,
                ])
                ->toArray();
        });
    }

    /**
     * Clear all merchant status caches
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
    }

    /**
     * Get the merchants for the status.
     */
    public function merchants(): HasMany
    {
        return $this->hasMany(Merchant::class, 'status_id');
    }
}

