<?php

namespace App\Constants;

class invoice_types {
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
}
