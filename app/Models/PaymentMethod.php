<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'description',
        'code',
        'logo_url',
        'is_one_time_payment',
        'info',
    ];

    protected $casts = [
        'is_one_time_payment' => 'boolean',
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
     * Scope a query to filter by is_one_time_payment.
     */
    public function scopeFilterByIsOneTimePayment($query, ?string $isOneTimePayment)
    {
        if ($isOneTimePayment !== null && $isOneTimePayment !== '' && $isOneTimePayment !== 'all') {
            // Convert string '1' or '0' to boolean
            $value = $isOneTimePayment === '1' || $isOneTimePayment === 'true';
            return $query->where('is_one_time_payment', $value);
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
            ->filterByIsOneTimePayment($filters['is_one_time_payment'] ?? null);
    }
}
