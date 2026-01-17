<?php

namespace Database\Seeders;

use App\Constants\message_types;
use App\Models\MessageType;
use Illuminate\Database\Seeder;

class MessageTypeSeeder extends Seeder
{

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        MessageType::query()->firstOrCreate([
            'code' => message_types::AUTHENTICATION_REQUEST,
        ], [
            'description'       => 'AUTHENTICATION_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::AUTHENTICATION_RESPONSE,
        ], [
            'description'       => 'AUTHENTICATION_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_ORDER_REQUEST,
        ], [
            'description'       => 'PAYMENT_ORDER_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_ORDER_RESPONSE,
        ], [
            'description'       => 'PAYMENT_ORDER_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_CHECKOUT_REQUEST,
        ], [
            'description'       => 'PAYMENT_CHECKOUT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_CHECKOUT_RESPONSE,
        ], [
            'description'       => 'PAYMENT_CHECKOUT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_INQUIRY_REQUEST,
        ], [
            'description'       => 'PAYMENT_INQUIRY_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_INQUIRY_RESPONSE,
        ], [
            'description'       => 'PAYMENT_INQUIRY_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_REFUND_REQUEST,
        ], [
            'description'       => 'PAYMENT_REFUND_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_REFUND_RESPONSE,
        ], [
            'description'       => 'PAYMENT_REFUND_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::GET_MERCHANTS_REQUEST,
        ], [
            'description'       => 'GET_MERCHANT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::GET_MERCHANTS_RESPONSE,
        ], [
            'description'       => 'GET_MERCHANT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::ADD_MERCHANT_REQUEST,
        ], [
            'description'       => 'ADD_MERCHANT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::ADD_MERCHANT_RESPONSE,
        ], [
            'description'       => 'ADD_MERCHANT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::EDIT_MERCHANT_REQUEST,
        ], [
            'description'       => 'EDIT_MERCHANT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::EDIT_MERCHANT_RESPONSE,
        ], [
            'description'       => 'EDIT_MERCHANT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_NOTIFICATION_REQUEST,
        ], [
            'description'       => 'PAYMENT_NOTIFICATION_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_NOTIFICATION_RESPONSE,
        ], [
            'description'       => 'PAYMENT_NOTIFICATION_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Common"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::POS_BILL_PULL_REQUEST,
        ], [
            'description'       => 'POS_BILL_PULL_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::POS_BILL_PULL_RESPONSE,
        ], [
            'description'       => 'POS_BILL_PULL_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::POS_PAYMENT_NOTIFICATION_REQUEST,
        ], [
            'description'       => 'POS_PAYMENT_NOTIFICATION_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::POS_PAYMENT_NOTIFICATION_RESPONSE,
        ], [
            'description'       => 'POS_PAYMENT_NOTIFICATION_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_CAPTURE_REQUEST,
        ], [
            'description'       => 'PAYMENT_CAPTURE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_CAPTURE_RESPONSE,
        ], [
            'description'       => 'PAYMENT_CAPTURE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::INVOICE_INQUIRY_REQUEST,
        ], [
            'description'       => 'INVOICE_INQUIRY_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::INVOICE_INQUIRY_RESPONSE,
        ], [
            'description'       => 'INVOICE_INQUIRY_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::INVOICE_CREATION_REQUEST,
        ], [
            'description'       => 'INVOICE_CREATION_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::INVOICE_CREATION_RESPONSE,
        ], [
            'description'       => 'INVOICE_CREATION_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENTS_REPORT_REQUEST,
        ], [
            'description'       => 'PAYMENTS_REPORT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENTS_REPORT_RESPONSE,
        ], [
            'description'       => 'PAYMENTS_REPORT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SSO_REQUEST,
        ], [
            'description'       => 'SSO_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SSO_RESPONSE,
        ], [
            'description'       => 'SSO_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::GET_PSPS_REQUEST,
        ], [
            'description'       => 'GET_PSPS_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::GET_PSPS_RESPONSE,
        ], [
            'description'       => 'GET_PSPS_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_AUTHORIZE_REQUEST,
        ], [
            'description'       => 'PAYMENT_AUTHORIZE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_AUTHORIZE_RESPONSE,
        ], [
            'description'       => 'PAYMENT_AUTHORIZE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_CREATE_ACCOUNT_REQUEST,
        ], [
            'description'       => 'KYC_CREATE_ACCOUNT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_CREATE_ACCOUNT_RESPONSE,
        ], [
            'description'       => 'KYC_CREATE_ACCOUNT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_UPLOAD_FILE_REQUEST,
        ], [
            'description'       => 'KYC_UPLOAD_FILE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_UPLOAD_FILE_RESPONSE,
        ], [
            'description'       => 'KYC_UPLOAD_FILE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_REVIEW_REQUEST,
        ], [
            'description'       => 'KYC_REVIEW_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_REVIEW_RESPONSE,
        ], [
            'description'       => 'KYC_REVIEW_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_GET_ACCOUNT_REQUEST,
        ], [
            'description'       => 'KYC_GET_ACCOUNT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_GET_ACCOUNT_RESPONSE,
        ], [
            'description'       => 'KYC_GET_ACCOUNT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_UPDATE_REQUEST,
        ], [
            'description'       => 'KYC_UPDATE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_UPDATE_RESPONSE,
        ], [
            'description'       => 'KYC_UPDATE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_DELETE_FILE_REQUEST,
        ], [
            'description'       => 'KYC_DELETE_FILE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_DELETE_FILE_RESPONSE,
        ], [
            'description'       => 'KYC_DELETE_FILE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_WEBHOOK_REQUEST,
        ], [
            'description'       => 'KYC_WEBHOOK_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_WEBHOOK_RESPONSE,
        ], [
            'description'       => 'KYC_WEBHOOK_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::BALANCE_TRANSFER_REQUEST,
        ], [
            'description'       => 'BALANCE_TRANSFER_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::BALANCE_TRANSFER_RESPONSE,
        ], [
            'description' => 'BALANCE_TRANSFER_RESPONSE',
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::CHECK_ELIGIBILITY_REQUEST,
        ], [
            'description'       => 'CHECK_ELIGIBILITY_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::CHECK_ELIGIBILITY_RESPONSE,
        ], [
            'description'       => 'CHECK_ELIGIBILITY_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_REGISTER_WEBHOOK_REQUEST,
        ], [
            'description'       => 'KYC_REGISTER_WEBHOOK_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::KYC_REGISTER_WEBHOOK_RESPONSE,
        ], [
            'description'       => 'KYC_REGISTER_WEBHOOK_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::CWALLET_INQUIRY_REQUEST,
        ], [
            'description'       => 'CWALLET_INQUIRY_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::CWALLET_INQUIRY_RESPONSE,
        ], [
            'description'       => 'CWALLET_INQUIRY_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::GET_TRANSFER_REQUEST,
        ], [
            'description'       => 'GET_TRANSFER_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::GET_TRANSFER_RESPONSE,
        ], [
            'description'       => 'GET_TRANSFER_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SMS_WEBHOOK_REQUEST,
        ], [
            'description'       => 'SMS_WEBHOOK_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SMS_WEBHOOK_RESPONSE,
        ], [
            'description'       => 'SMS_WEBHOOK_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::SMS_MESSAGE_REQUEST,
        ], [
            'description'       => 'SMS_MESSAGE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SMS_MESSAGE_RESPONSE,
        ], [
            'description'       => 'SMS_MESSAGE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::SMS_INQUIRY_REQUEST,
        ], [
            'description'       => 'SMS_INQUIRY_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SMS_INQUIRY_RESPONSE,
        ], [
            'description'       => 'SMS_INQUIRY_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::POST_CUSTOMER_FEEDBACK_REQUEST,
        ], [
            'description'       => 'POST_CUSTOMER_FEEDBACK_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::POST_CUSTOMER_FEEDBACK_RESPONSE,
        ], [
            'description'       => 'POST_CUSTOMER_FEEDBACK_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_KEY_REQUEST,
        ], [
            'description'       => 'PAYMENT_KEY_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_KEY_RESPONSE,
        ], [
            'description'       => 'PAYMENT_KEY_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_TOKENIZATION_REQUEST,
        ], [
            'description'       => 'PAYMENT_TOKENIZATION_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);
        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_TOKENIZATION_RESPONSE,
        ], [
            'description'       => 'PAYMENT_TOKENIZATION_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);


        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_METHOD_REQUEST,
        ], [
            'description'       => 'PAYMENT_METHOD_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_METHOD_RESPONSE,
        ], [
            'description'       => 'PAYMENT_METHOD_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::INITIATE_PAYMENT_REQUEST,
        ], [
            'description'       => 'INITIATE_PAYMENT_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::INITIATE_PAYMENT_RESPONSE,
        ], [
            'description'       => 'INITIATE_PAYMENT_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::PAYMENT_PAGE_DATA,
        ], [
            'description'       => 'PAYMENT_PAGE_DATA',
            'message_direction' => message_types::MESSAGE_DIRECTION["External"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SYNC_USER_DEVICE_REQUEST,
        ], [
            'description'       => 'SYNC_USER_DEVICE_REQUEST',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);

        MessageType::query()->firstOrCreate([
            'code' => message_types::SYNC_USER_DEVICE_RESPONSE,
        ], [
            'description'       => 'SYNC_USER_DEVICE_RESPONSE',
            'message_direction' => message_types::MESSAGE_DIRECTION["Internal"]
        ]);



    }
}
