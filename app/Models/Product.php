<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        "en_name",
        "ar_name",
        "signing_active",
        "callback_url",
        "webhook_url",
        "invoice_inquiry_api",
        "invoice_creation_api",
        "hmac_key",
        "token_key",
        "secret_key",
    ];

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
