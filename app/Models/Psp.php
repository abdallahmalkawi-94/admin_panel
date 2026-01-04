<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Psp extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'country_code',
        'settlement_currency_code',
        'monthly_fees',
        'psp_status_id',
        'contact_person',
        'contact_email',
        'base_url',
        'sdk_version',
        'dashboard_url',
        'support_money_splitting',
        'notes',
        'attachment',
        'password',
        'bank_id',
        'bank_account_number',
        'iban',
        'enable_auto_transfer',
    ];

    protected $casts = [
        'support_money_splitting' => 'boolean',
        'enable_auto_transfer' => 'boolean',
        'monthly_fees' => 'decimal:2',
    ];

    /**
     * Get the country that owns the PSP.
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_code', 'iso2');
    }

    /**
     * Get the settlement currency that owns the PSP.
     */
    public function settlementCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'settlement_currency_code', 'code');
    }

    /**
     * Get the status that owns the PSP.
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(PspStatus::class, 'psp_status_id');
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }
}
