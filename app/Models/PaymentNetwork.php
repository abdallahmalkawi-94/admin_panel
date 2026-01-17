<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentNetwork extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

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
     * Scope a query to apply all filters at once.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query->filterByName($filters['name'] ?? null);
    }
}
