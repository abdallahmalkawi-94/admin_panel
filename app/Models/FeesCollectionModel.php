<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeesCollectionModel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'is_default',
        'psp_payment_method_id',
        'merchant_id',
        'invoice_type_id',
        'from',
        'to',
        'foc_fixed',
        'fom_fixed',
        'foc_percentage',
        'fom_percentage',
        'foc_psp_cost_fixed',
        'fom_psp_cost_fixed',
        'fom_psp_cost_percentage',
        'foc_psp_cost_percentage',
        'installment_fom_fixed',
        'installment_fom_percentage',
        'installment_foc_fixed',
        'installment_foc_percentage',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'from' => 'decimal:5',
        'to' => 'decimal:5',
        'foc_fixed' => 'decimal:5',
        'fom_fixed' => 'decimal:5',
        'foc_percentage' => 'decimal:5',
        'fom_percentage' => 'decimal:5',
        'foc_psp_cost_fixed' => 'decimal:5',
        'fom_psp_cost_fixed' => 'decimal:5',
        'fom_psp_cost_percentage' => 'decimal:5',
        'foc_psp_cost_percentage' => 'decimal:5',
        'installment_fom_fixed' => 'decimal:5',
        'installment_fom_percentage' => 'decimal:5',
        'installment_foc_fixed' => 'decimal:5',
        'installment_foc_percentage' => 'decimal:5',
    ];

    public function pspPaymentMethod(): BelongsTo
    {
        return $this->belongsTo(PspPaymentMethod::class);
    }
}
