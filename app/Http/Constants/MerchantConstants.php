<?php

namespace App\Http\Constants;

class MerchantConstants
{
    // Payout Models
    const PAYOUT_MODEL_MANUAL = 1;
    const PAYOUT_MODEL_DAILY = 2;
    const PAYOUT_MODEL_WEEKLY = 3;
    const PAYOUT_MODEL_MONTHLY = 4;
    const PAYOUT_MODEL_ANNUAL = 5;

    // Supported Order Types
    const ORDER_TYPE_PUSH = 1;
    const ORDER_TYPE_PULL = 2;

    /**
     * Get all payout models
     */
    public static function getPayoutModels(): array
    {
        return [
            self::PAYOUT_MODEL_MANUAL => 'Manual',
            self::PAYOUT_MODEL_DAILY => 'Daily',
            self::PAYOUT_MODEL_WEEKLY => 'Weekly',
            self::PAYOUT_MODEL_MONTHLY => 'Monthly',
            self::PAYOUT_MODEL_ANNUAL => 'Annual',
        ];
    }

    /**
     * Get all order types
     */
    public static function getOrderTypes(): array
    {
        return [
            self::ORDER_TYPE_PUSH => 'Push',
            self::ORDER_TYPE_PULL => 'Pull',
        ];
    }
}

