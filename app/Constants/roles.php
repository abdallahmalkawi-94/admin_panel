<?php

namespace App\Constants;

class roles
{
    const SYSTEM_ADMIN = 'SYSTEM_ADMIN';
    const SYSTEM_USER = 'SYSTEM_USER';
    const SYSTEM_READER = 'SYSTEM_READER';
    const ACCOUNT_MANAGER = 'ACCOUNT_MANAGER';
    const PRODUCT_ADMIN = 'PRODUCT_ADMIN';
    const MERCHANT_ADMIN = 'MERCHANT_ADMIN';
    const MERCHANT_ACCOUNT_MANGER = 'MERCHANT_ACCOUNT_MANGER';
    const MERCHANT_USER = 'MERCHANT_USER';
    const SALES = 'SALES';
    const OPERATION_USER = 'OPERATION_USER';

    const ROLES = [
        self::SYSTEM_ADMIN,
        self::SYSTEM_USER,
        self::SYSTEM_READER,
        self::ACCOUNT_MANAGER,
        self::PRODUCT_ADMIN,
        self::MERCHANT_ADMIN,
        self::MERCHANT_ACCOUNT_MANGER,
        self::MERCHANT_USER,
        self::SALES,
        self::OPERATION_USER,
    ];
}
