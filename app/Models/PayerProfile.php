<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayerProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'full_name',
        'username',
        'referral_id',
        'email',
        'mobile_number',
        'product_id',
        'merchant_id',
        'status',
        'total_points',
        'identity_no',
        'identity_type_id',
    ];

    protected $casts = [
        'status' => 'integer',
        'total_points' => 'integer',
        'identity_type_id' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    public function scopeFilterByName($query, ?string $name)
    {
        if (!empty($name)) {
            return $query->where('full_name', 'like', '%' . $name . '%');
        }

        return $query;
    }

    public function scopeFilterByUsername($query, ?string $username)
    {
        if (!empty($username)) {
            return $query->where('username', 'like', '%' . $username . '%');
        }

        return $query;
    }

    public function scopeFilterByEmail($query, ?string $email)
    {
        if (!empty($email)) {
            return $query->where('email', 'like', '%' . $email . '%');
        }

        return $query;
    }

    public function scopeFilterByMobileNumber($query, ?string $mobileNumber)
    {
        if (!empty($mobileNumber)) {
            return $query->where('mobile_number', 'like', '%' . $mobileNumber . '%');
        }

        return $query;
    }

    public function scopeFilterByStatus($query, ?string $status)
    {
        if ($status !== null && $status !== '' && is_numeric($status)) {
            return $query->where('status', (int) $status);
        }

        return $query;
    }

    public function scopeFilterByProduct($query, ?string $productId)
    {
        if (!empty($productId) && is_numeric($productId)) {
            return $query->where('product_id', (int) $productId);
        }

        return $query;
    }

    public function scopeFilterByMerchant($query, ?string $merchantId)
    {
        if (!empty($merchantId) && is_numeric($merchantId)) {
            return $query->where('merchant_id', (int) $merchantId);
        }

        return $query;
    }

    public function scopeApplyFilters($query, array $filters)
    {
        return $query
            ->filterByName($filters['name'] ?? null)
            ->filterByUsername($filters['username'] ?? null)
            ->filterByEmail($filters['email'] ?? null)
            ->filterByMobileNumber($filters['mobile_number'] ?? null)
            ->filterByStatus($filters['status'] ?? null)
            ->filterByProduct($filters['product_id'] ?? null)
            ->filterByMerchant($filters['merchant_id'] ?? null);
    }
}
