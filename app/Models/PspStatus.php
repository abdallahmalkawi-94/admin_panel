<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Cache;

class PspStatus extends Model
{
    protected $fillable = [
        'code',
        'description',
    ];

    const ACTIVE = 1;
    const INACTIVE = 2;
    const SUSPENDED = 3;

    const STATUS = [
        1 => "Active",
        2 => "Inactive",
        3 => "Suspended"
    ];

    // Cache constants
    const CACHE_KEY_ALL = 'psp_statuses:all';
    const CACHE_KEY_DROPDOWN = 'psp_statuses:all:dropdown';
    const CACHE_TTL = 86400; // 24 hours

    /**
     * Get all cached PSP statuses
     * Usage: PspStatus::cached()
     */
    public static function cached(): Collection
    {
        return Cache::remember(self::CACHE_KEY_ALL, self::CACHE_TTL, function () {
            return self::query()->get(['id', 'code', 'description']);
        });
    }

    /**
     * Get cached PSP statuses for dropdown
     * Usage: PspStatus::dropdown()
     */
    public static function dropdown(): array
    {
        return Cache::remember(self::CACHE_KEY_DROPDOWN, self::CACHE_TTL, function () {
            return self::query()
                ->get(['id', 'code', 'description'])
                ->map(fn($status) => [
                    'id' => $status->id,
                    'code' => $status->code,
                    'description' => $status->description,
                ])
                ->toArray();
        });
    }

    /**
     * Clear all PSP status caches
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY_ALL);
        Cache::forget(self::CACHE_KEY_DROPDOWN);
    }

    /**
     * Get the PSPs for the status.
     */
    public function psps(): HasMany
    {
        return $this->hasMany(Psp::class, 'psp_status_id');
    }
}
