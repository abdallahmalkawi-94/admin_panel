<?php

namespace App\Constants;

use App\Models\Merchant;
use App\Models\Product;
use App\Models\Psp;
use App\Models\User;

class permissions
{
    const SHOW_USER = 'show_user';
    const ADD_USER = 'add_user';
    const EDIT_USER = 'edit_user';
    const DELETE_USER = 'delete_user';

    const SHOW_PRODUCT = 'show_product';
    const ADD_PRODUCT = 'add_product';
    const EDIT_PRODUCT = 'edit_product';
    const DELETE_PRODUCT = 'delete_product';

    const SHOW_MERCHANT = 'show_merchant';
    const ADD_MERCHANT = 'add_merchant';
    const EDIT_MERCHANT = 'edit_merchant';
    const DELETE_MERCHANT = 'delete_merchant';
    const SHOW_MERCHANT_PAYMENT = 'show_merchant_payment';
    const ADD_MERCHANT_PAYMENT = 'add_merchant_payment';
    const EDIT_MERCHANT_PAYMENT = 'edit_merchant_payment';
    const DELETE_MERCHANT_PAYMENT = 'delete_merchant_payment';

    const SHOW_MERCHANT_PAYMENT_FEE = 'show_merchant_payment_fee';
    const ADD_MERCHANT_PAYMENT_FEE = 'add_merchant_payment_fee';
    const EDIT_MERCHANT_PAYMENT_FEE = 'edit_merchant_payment_fee';
    const DELETE_MERCHANT_PAYMENT_FEE = 'delete_merchant_payment_fee';

    const SHOW_PSP = 'show_psp';
    const ADD_PSP = 'add_psp';
    const EDIT_PSP = 'edit_psp';
    const DELETE_PSP = 'delete_psp';
    const SHOW_PSP_PAYMENT = 'show_psp_payment';
    const ADD_PSP_PAYMENT = 'add_psp_payment';
    const EDIT_PSP_PAYMENT = 'edit_psp_payment';
    const DELETE_PSP_PAYMENT = 'delete_psp_payment';
    const SHOW_PSP_PAYMENT_FEE = 'show_psp_payment_fee';
    const ADD_PSP_PAYMENT_FEE = 'add_psp_payment_fee';
    const EDIT_PSP_PAYMENT_FEE = 'edit_psp_payment_fee';
    const DELETE_PSP_PAYMENT_FEE = 'delete_psp_payment_fee';

    const USER_PERMISSIONS = [
        'permissions' => [
            self::SHOW_USER,
            self::ADD_USER,
            self::EDIT_USER,
            self::DELETE_USER,
        ],
        'module' => User::class
    ];

    const PRODUCT_PERMISSIONS = [
        'permissions' => [
            self::SHOW_PRODUCT,
            self::ADD_PRODUCT,
            self::EDIT_PRODUCT,
            self::DELETE_PRODUCT,
        ],
        'module' => Product::class
    ];

    const MERCHANT_PERMISSIONS = [
        'permissions' => [
            self::SHOW_MERCHANT,
            self::ADD_MERCHANT,
            self::EDIT_MERCHANT,
            self::DELETE_MERCHANT,
            self::SHOW_MERCHANT_PAYMENT,
            self::ADD_MERCHANT_PAYMENT,
            self::EDIT_MERCHANT_PAYMENT,
            self::DELETE_MERCHANT_PAYMENT,
            self::SHOW_MERCHANT_PAYMENT_FEE,
            self::ADD_MERCHANT_PAYMENT_FEE,
            self::EDIT_MERCHANT_PAYMENT_FEE,
            self::DELETE_MERCHANT_PAYMENT_FEE,
        ],
        'module' => Merchant::class
    ];

    const PSP_PERMISSIONS = [
        'permissions' => [
            self::SHOW_PSP,
            self::ADD_PSP,
            self::EDIT_PSP,
            self::DELETE_PSP,
            self::SHOW_PSP_PAYMENT,
            self::ADD_PSP_PAYMENT,
            self::EDIT_PSP_PAYMENT,
            self::DELETE_PSP_PAYMENT,
            self::SHOW_PSP_PAYMENT_FEE,
            self::ADD_PSP_PAYMENT_FEE,
            self::EDIT_PSP_PAYMENT_FEE,
            self::DELETE_PSP_PAYMENT_FEE,
        ],
        'module' => PSP::class
    ];
    const PERMISSIONS = [
        self::USER_PERMISSIONS,
        self::PRODUCT_PERMISSIONS,
        self::MERCHANT_PERMISSIONS,
        self::PSP_PERMISSIONS,
    ];
}
