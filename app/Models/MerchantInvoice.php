<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MerchantInvoice extends Model
{
    use SoftDeletes;

    protected $table = 'merchant_invoices';

    protected $fillable = [
        'merchant_id',
        'invoice_type_id',
    ];

    /**
     * Get the merchant that owns the invoice.
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
}
