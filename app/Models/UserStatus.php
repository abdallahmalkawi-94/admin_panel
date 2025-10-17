<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class UserStatus extends Model
{
    protected $fillable = [
        'description',
    ];

    // Cache constants
    const CACHE_KEY_ALL = 'user_statuses:all';
    const CACHE_KEY_DROPDOWN = 'user_statuses:all:dropdown';
    const CACHE_TTL = 86400; // 24 hours

    /**
     * Get all cached user statuses
     * Usage: UserStatus::cached()
     */
    public static function cached(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return self::query()->get(['id', 'description']);
        });
    }

    /**
     * Get cached user statuses for dropdown
     * Usage: UserStatus::dropdown()
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
     * Clear all user status caches
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
    }

    /**
     * Get the users for the status.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'status_id');
    }
}

