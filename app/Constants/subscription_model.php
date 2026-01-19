<?php

namespace App\Constants;
class subscription_model
{

    public const REVENUE_SHARING = 1;

    public const LICENCE = 2;

    public const SUBSCRIPTION_MODEL = [
        self::REVENUE_SHARING => "Revenue Sharing",
        self::LICENCE         => "Licence"
    ];
}
