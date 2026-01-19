<?php

namespace App\Models;

use App\Constants\fees_type;
use App\Constants\payout_models;
use App\Constants\refund_option;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PspPaymentMethod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'psp_id',
        'payment_method_id',
        'merchant_id',
        'invoice_type_id',
        'refund_option_id',
        'payout_model_id',
        'support_tokenization',
        'subscription_model',
        'is_active',
        'shown_in_checkout',
        'support_international_payment',
        'post_fees_to_psp',
        'fees_type',
        'priority',
        'max_allowed_amount',
        'min_allowed_amount',
        'config',
        'test_config',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'support_tokenization' => 'boolean',
        'is_active' => 'boolean',
        'shown_in_checkout' => 'boolean',
        'support_international_payment' => 'boolean',
        'post_fees_to_psp' => 'boolean',
        'config' => 'array',
        'test_config' => 'array',
        'priority' => 'integer',
        'max_allowed_amount' => 'integer',
        'min_allowed_amount' => 'integer',
        'fees_type' => 'integer',
        'subscription_model' => 'integer',
    ];

    /**
     * Get the PSP that owns this payment method.
     */
    public function psp(): BelongsTo
    {
        return $this->belongsTo(Psp::class);
    }

    /**
     * Get the payment method.
     */
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /**
     * Get the merchant.
     */
    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    /**
     * Get the invoice type.
     */
    public function invoiceType(): BelongsTo
    {
        return $this->belongsTo(InvoiceType::class);
    }

    /**
     * Get the refund option.
     */
    public function refundOption(): BelongsTo
    {
        return $this->belongsTo(RefundOption::class);
    }

    /**
     * Get the payout model.
     */
    public function payoutModel(): BelongsTo
    {
        return $this->belongsTo(PayoutModel::class);
    }

    /**
     * Get the user who created this record.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this record.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Scope a query to filter by psp_id.
     */
    public function scopeFilterByPspId($query, ?string $pspId)
    {
        if (!empty($pspId)) {
            return $query->where('psp_id', $pspId);
        }
        return $query;
    }

    /**
     * Scope a query to filter by payment_method_id.
     */
    public function scopeFilterByPaymentMethodId($query, ?string $paymentMethodId)
    {
        if (!empty($paymentMethodId)) {
            return $query->where('payment_method_id', $paymentMethodId);
        }
        return $query;
    }

    /**
     * Scope a query to filter by merchant_id.
     */
    public function scopeFilterByMerchantId($query, ?string $merchantId)
    {
        if ($merchantId !== null && $merchantId !== '' && $merchantId !== 'all') {
            return $query->where('merchant_id', $merchantId);
        }
        return $query;
    }

    /**
     * Scope a query to filter by is_active.
     */
    public function scopeFilterByIsActive($query, ?string $isActive)
    {
        if ($isActive !== null && $isActive !== '' && $isActive !== 'all') {
            $value = $isActive === '1' || $isActive === 'true';
            return $query->where('is_active', $value);
        }
        return $query;
    }

    /**
     * Scope a query to apply all filters at once.
     */
    public function scopeApplyFilters($query, array $filters)
    {
        return $query
            ->filterByPspId($filters['psp_id'] ?? null)
            ->filterByPaymentMethodId($filters['payment_method_id'] ?? null)
            ->filterByMerchantId($filters['merchant_id'] ?? null)
            ->filterByIsActive($filters['is_active'] ?? null);
    }

    /**
     * Get the fees_type
     */
//    protected function feesType(): Attribute
//    {
//        return Attribute::make(
//            get: fn (int $value) => fees_type::FEES_TYPE[$value],
//        );
//    }
//
//    /**
//     * Get the refund_option
//     */
//    protected function refundOptionId(): Attribute
//    {
//        return Attribute::make(
//            get: fn (int $value) => refund_option::REFUND_OPTIONS[$value],
//        );
//    }
//
//    protected function payoutModelId(): Attribute {
//        return Attribute::make(
//            get: fn (int $value) => payout_models::PAYOUT_MODEL[$value],
//        );
//    }
}
