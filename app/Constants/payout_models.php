<?php

namespace App\Constants;

class payout_models
{
    const WEEKLY            = 1;
    const BIWEEKLY          = 2;
    const MONTHLY           = 3;
    const EVERY_THREE_MONTH = 4;
    const SIMI_ANNUAL       = 5;

    const PAYOUT_MODEL = [
        1 => 'WEEKLY',
        2 => 'BIWEEKLY',
        3 => 'MONTHLY',
        4 => 'EVERY_THREE_MONTH',
        5 => 'SIMI_ANNUAL'
    ];
}
