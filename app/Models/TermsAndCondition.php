<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TermsAndCondition extends Model
{
    protected $fillable = [
        'content',
        'version',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the merchant settings for the terms and condition.
     */
    public function merchantSettings(): HasMany
    {
        return $this->hasMany(MerchantSetting::class);
    }
}
