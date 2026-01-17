<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageType extends Model
{
    protected $fillable = [
        'code',
        'description',
        'message_direction',
    ];

    /**
     * Scope a query to filter by description.
     */
    public function scopeFilterByDescription($query, ?string $description)
    {
        if (!empty($description)) {
            return $query->where('description', 'like', '%' . $description . '%');
        }

        return $query;
    }

    /**
     * Scope a query to filter by code.
     */
    public function scopeFilterByCode($query, ?string $code)
    {
        if (!empty($code)) {
            return $query->where('code', $code);
        }

        return $query;
    }

    /**
     * Scope a query to apply all filters at once.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query
            ->filterByDescription($filters['description'] ?? null)
            ->filterByCode($filters['code'] ?? null);
    }
}
