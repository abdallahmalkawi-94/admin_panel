<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MerchantSetting extends Model
{
    protected $fillable = [
        'merchant_id',
        'payout_model',
        'bank_id',
        'iban',
        'bank_account_no',
        'supported_order_type',
        'has_custom_urls',
        'urls_settings',
        'attachment',
        'terms_and_condition_id',
        'is_enable_sms_notification',
        'monthly_sms',
        'monthly_sms_counter',
        'daily_sms',
        'daily_sms_counter',
        'is_enable_email_notification',
        'is_enable_auto_redirect',
        'country_code',
        'currency_code'
    ];

    protected $casts = [
        'has_custom_urls' => 'boolean',
        'is_enable_sms_notification' => 'boolean',
        'is_enable_email_notification' => 'boolean',
        'is_enable_auto_redirect' => 'boolean',
        'urls_settings' => 'array',
    ];

    /**
     * Get the merchant for the settings.
     */
    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class);
    }

    /**
     * Get the bank for the settings.
     */
    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }

    /**
     * Get the terms and conditions.
     */
    public function termsAndCondition(): BelongsTo
    {
        return $this->belongsTo(TermsAndCondition::class);
    }

    public function country(): BelongsTo {
        return $this->belongsTo(Country::class, 'country_code', 'iso2');
    }

    public function currency(): BelongsTo {
        return $this->belongsTo(Currency::class, 'currency_code', 'code');
    }
}
