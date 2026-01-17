<?php

namespace App\Constants;

class refund_option
{
    const NO_REFUND        = 1;
    const ONE_TIME_REFUND  = 2;
    const MULTIPLE_REFUNDS = 3;

    const REFUND_OPTIONS = [
        1 => 'NO_REFUND',
        2 => 'ONE_TIME_REFUND',
        3 => 'MULTIPLE_REFUNDS',
    ];
}
