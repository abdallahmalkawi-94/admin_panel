<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Merchant extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'en_name',
        'ar_name',
        'commercial_registry_name',
        'product_id',
        'referral_id',
        'parent_merchant_id',
        'status_id',
        'is_live',
        'logo_url',
        'attachment'
    ];

    protected $casts = [
        'is_live' => 'boolean',
    ];

    /**
     * Get the product for the merchant.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the parent merchant.
     */
    public function parentMerchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'parent_merchant_id');
    }

    public function childMerchants(): HasMany
    {
        return $this->hasMany(Merchant::class, 'parent_merchant_id', 'id');
    }
    /**
     * Get the status for the merchant.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(MerchantStatus::class, 'status_id');
    }

    /**
     * Get the merchant settings.
     */
    public function settings(): HasOne
    {
        return $this->hasOne(MerchantSetting::class);
    }

    /**
     * Get the invoice types for the merchant.
     */
    public function invoiceTypes(): BelongsToMany
    {
        return $this->belongsToMany(InvoiceType::class, 'merchant_invoices')
            ->withTimestamps()
            ->withPivot('deleted_at')
            ->wherePivot('deleted_at', null);
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
     * Scope a query to filter by status.
     */
    public function scopeFilterByStatus($query, ?string $statusId)
    {
        if (!empty($statusId) && is_numeric($statusId)) {
            return $query->where('status_id', $statusId);
        }
        return $query;
    }

    /**
     * Scope a query to filter by product.
     */
    public function scopeFilterByProduct($query, ?string $productId)
    {
        if (!empty($productId) && is_numeric($productId)) {
            return $query->where('product_id', $productId);
        }
        return $query;
    }

    /**
     * Scope a query to filter by live status.
     */
    public function scopeFilterByIsLive($query, ?string $isLive)
    {
        if (!empty($isLive) && in_array($isLive, ['0', '1'])) {
            return $query->where('is_live', (bool)$isLive);
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
            ->filterByStatus($filters['status_id'] ?? null)
            ->filterByProduct($filters['product_id'] ?? null)
            ->filterByIsLive($filters['is_live'] ?? null);
    }
}
