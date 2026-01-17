<?php

namespace App\Constants;

class message_types {
    const               MESSAGE_DIRECTION                 = [
        "Internal" => 1,
        "External" => 2,
        "Common"   => 3
    ];

    public const        AUTHENTICATION_REQUEST            = 1;
    public const        AUTHENTICATION_RESPONSE           = 2;
    public const        PAYMENT_ORDER_REQUEST             = 3;
    public const        PAYMENT_ORDER_RESPONSE            = 4;
    public const        PAYMENT_CHECKOUT_REQUEST          = 5;
    public const        PAYMENT_CHECKOUT_RESPONSE         = 6;
    public const        PAYMENT_INQUIRY_REQUEST           = 7;
    public const        PAYMENT_INQUIRY_RESPONSE          = 8;
    public const        PAYMENT_REFUND_REQUEST            = 9;
    public const        PAYMENT_REFUND_RESPONSE           = 10;
    public const        GET_MERCHANTS_REQUEST             = 11;
    public const        GET_MERCHANTS_RESPONSE            = 12;
    public const        ADD_MERCHANT_REQUEST              = 13;
    public const        ADD_MERCHANT_RESPONSE             = 14;
    public const        EDIT_MERCHANT_REQUEST             = 15;
    public const        EDIT_MERCHANT_RESPONSE            = 16;
    public const        PAYMENT_NOTIFICATION_REQUEST      = 17;
    public const        PAYMENT_NOTIFICATION_RESPONSE     = 18;
    public const        POS_BILL_PULL_REQUEST             = 19;
    public const        POS_BILL_PULL_RESPONSE            = 20;
    public const        POS_PAYMENT_NOTIFICATION_REQUEST  = 21;
    public const        POS_PAYMENT_NOTIFICATION_RESPONSE = 22;
    public const        PAYMENT_CAPTURE_REQUEST           = 23;
    public const        PAYMENT_CAPTURE_RESPONSE          = 24;
    public const        INVOICE_INQUIRY_REQUEST           = 25;
    public const        INVOICE_INQUIRY_RESPONSE          = 26;
    public const        INVOICE_CREATION_REQUEST          = 27;
    public const        INVOICE_CREATION_RESPONSE         = 28;
    public const        PAYMENTS_REPORT_REQUEST           = 29;
    public const        PAYMENTS_REPORT_RESPONSE          = 30;
    public const        SSO_REQUEST                       = 31;
    public const        SSO_RESPONSE                      = 32;
    public const        GET_PSPS_REQUEST                  = 33;
    public const        GET_PSPS_RESPONSE                 = 34;
    public const        PAYMENT_AUTHORIZE_REQUEST         = 35;
    public const        PAYMENT_AUTHORIZE_RESPONSE        = 36;
    public const        KYC_CREATE_ACCOUNT_REQUEST        = 37;
    public const        KYC_CREATE_ACCOUNT_RESPONSE       = 38;
    public const        KYC_UPLOAD_FILE_REQUEST           = 39;
    public const        KYC_UPLOAD_FILE_RESPONSE          = 40;
    public const        KYC_REVIEW_REQUEST                = 41;
    public const        KYC_REVIEW_RESPONSE               = 42;
    public const        KYC_GET_ACCOUNT_REQUEST           = 43;
    public const        KYC_GET_ACCOUNT_RESPONSE          = 44;
    public const        KYC_UPDATE_REQUEST                = 45;
    public const        KYC_UPDATE_RESPONSE               = 46;
    public const        KYC_DELETE_FILE_REQUEST           = 47;
    public const        KYC_DELETE_FILE_RESPONSE          = 48;
    public const        KYC_WEBHOOK_REQUEST               = 49;
    public const        KYC_WEBHOOK_RESPONSE              = 50;
    public const        BALANCE_TRANSFER_REQUEST          = 51;
    public const        BALANCE_TRANSFER_RESPONSE         = 52;
    public const        CHECK_ELIGIBILITY_REQUEST         = 53;
    public const        CHECK_ELIGIBILITY_RESPONSE        = 54;
    public const        KYC_REGISTER_WEBHOOK_REQUEST      = 55;
    public const        KYC_REGISTER_WEBHOOK_RESPONSE     = 56;
    public const        CWALLET_INQUIRY_REQUEST           = 57;
    public const        CWALLET_INQUIRY_RESPONSE          = 58;
    public const        GET_TRANSFER_REQUEST              = 59;
    public const        GET_TRANSFER_RESPONSE             = 60;
    public const        SMS_WEBHOOK_REQUEST               = 61;
    public const        SMS_WEBHOOK_RESPONSE              = 62;
    public const        SMS_MESSAGE_REQUEST               = 63;
    public const        SMS_MESSAGE_RESPONSE              = 64;
    public const        SMS_INQUIRY_REQUEST               = 65;
    public const        SMS_INQUIRY_RESPONSE              = 66;
    public const        POST_CUSTOMER_FEEDBACK_REQUEST    = 67;
    public const        POST_CUSTOMER_FEEDBACK_RESPONSE   = 68;
    public const        PAYMENT_KEY_REQUEST               = 69;
    public const        PAYMENT_KEY_RESPONSE              = 70;
    public const        PAYMENT_TOKENIZATION_REQUEST      = 71;
    public const        PAYMENT_TOKENIZATION_RESPONSE     = 72;
    public const        PAYMENT_METHOD_REQUEST            = 73;
    public const        PAYMENT_METHOD_RESPONSE           = 74;

    public const INITIATE_PAYMENT_REQUEST  = 75;
    public const INITIATE_PAYMENT_RESPONSE = 76;
    public const PAYMENT_PAGE_DATA         = 77;
    public const SYNC_USER_DEVICE_REQUEST         = 78;
    public const SYNC_USER_DEVICE_RESPONSE         = 79;
}
