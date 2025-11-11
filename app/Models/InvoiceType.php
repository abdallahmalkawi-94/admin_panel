<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class InvoiceType extends Model
{
    protected $table = 'invoice_types';

    protected $fillable = [
        'code',
        'description',
    ];

    const TUITION_FEES      = 1;
    const SCHOOL_CLUB       = 2;
    const E_COMMERCE        = 3;
    const ONLINE_COURSE     = 4;
    const REGISTRATION_FEES = 5;
    const CANTEEN_POINTS    = 6;
    const ERP_PAYMENT       = 7;
    const CWALLET_MONEY_IN  = 14;

    const INVOICE_TYPE = [
        self::TUITION_FEES      => "Tuition Fees",
        self::SCHOOL_CLUB       => "School Club",
        self::E_COMMERCE        => "E-Commerce",
        self::ONLINE_COURSE     => "Online Course",
        self::REGISTRATION_FEES => "Registration Fees",
        self::CANTEEN_POINTS    => "Canteen Points",
        self::ERP_PAYMENT       => "ERP Payment",
        self::CWALLET_MONEY_IN  => "CWallet Money In"
    ];

    /**
     * Get the merchants that have this invoice type.
     */
    public function merchants(): BelongsToMany
    {
        return $this->belongsToMany(Merchant::class, 'merchant_invoices')
            ->withTimestamps()
            ->withPivot('deleted_at')
            ->wherePivot('deleted_at', null);
    }
}
