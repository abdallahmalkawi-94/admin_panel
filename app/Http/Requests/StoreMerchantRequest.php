<?php

namespace App\Http\Requests;

use App\Http\Constants\MerchantConstants;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMerchantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $payoutModels = array_keys(MerchantConstants::getPayoutModels());
        $orderTypes = array_keys(MerchantConstants::getOrderTypes());

        return [
            // Merchant basic info
            'en_name' => ['required', 'string', 'max:255'],
            'ar_name' => ['required', 'string', 'max:255'],
            'commercial_registry_name' => ['nullable', 'string', 'max:255'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'referral_id' => ['required', 'integer', Rule::unique('merchants')->where(function ($query) {
                return $query->where('product_id', request('product_id'));
            })],
            'parent_merchant_id' => ['nullable', 'integer', 'exists:merchants,id'],
            'status_id' => ['required', 'integer', 'exists:merchant_statuses,id'],
            'is_live' => ['boolean'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,svg', 'max:2048'],
            'attachment' => ['nullable', 'file', 'mimes:zip,rar', 'max:10240'],

            // Merchant settings
            'settings' => ['required', 'array'],
            'settings.payout_model' => ['required', 'integer', Rule::in($payoutModels)],
            'settings.bank_id' => ['nullable', 'integer', 'exists:banks,id'],
            'settings.iban' => ['nullable', 'string', 'max:255'],
            'settings.bank_account_no' => ['nullable', 'string', 'max:255'],
            'settings.supported_order_type' => ['required', 'integer', Rule::in($orderTypes)],
            'settings.has_custom_urls' => ['boolean'],
            'settings.urls_settings' => ['nullable', 'array'],
            'settings.urls_settings.callback_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.webhook_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.invoice_inquiry_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.invoice_creation_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.token_key' => ['nullable', 'string', 'max:255'],
            'settings.terms_and_condition_id' => ['required', 'integer', 'exists:terms_and_conditions,id'],
            'settings.is_enable_sms_notification' => ['boolean'],
            'settings.monthly_sms' => ['integer', 'min:0'],
            'settings.daily_sms' => ['integer', 'min:0'],
            'settings.monthly_sms_counter' => ['integer', 'min:0'],
            'settings.daily_sms_counter' => ['integer', 'min:0'],
            'settings.is_enable_email_notification' => ['boolean'],
            'settings.is_enable_auto_redirect' => ['boolean'],
            'settings.country_code' => ['required', 'string', 'max:2', 'exists:countries,iso2'],
            'settings.currency_code' => ['required', 'string', 'max:3', 'exists:currencies,code'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'en_name' => 'English name',
            'ar_name' => 'Arabic name',
            'commercial_registry_name' => 'commercial registry name',
            'product_id' => 'product',
            'referral_id' => 'referral ID',
            'parent_merchant_id' => 'parent merchant',
            'status_id' => 'status',
            'is_live' => 'live status',
            'logo' => 'logo',
            'attachment' => 'attachment',
            'settings.payout_model' => 'payout model',
            'settings.bank_id' => 'bank',
            'settings.iban' => 'IBAN',
            'settings.bank_account_no' => 'bank account number',
            'settings.supported_order_type' => 'supported order type',
            'settings.has_custom_urls' => 'has custom URLs',
            'settings.urls_settings.callback_url' => 'callback URL',
            'settings.urls_settings.webhook_url' => 'webhook URL',
            'settings.urls_settings.invoice_inquiry_url' => 'invoice inquiry URL',
            'settings.urls_settings.invoice_creation_url' => 'invoice creation URL',
            'settings.urls_settings.token_key' => 'token key',
            'settings.terms_and_condition_id' => 'terms and conditions',
            'settings.is_enable_sms_notification' => 'SMS notifications',
            'settings.monthly_sms' => 'monthly SMS limit',
            'settings.daily_sms' => 'daily SMS limit',
            'settings.is_enable_email_notification' => 'email notifications',
            'settings.is_enable_auto_redirect' => 'auto redirect',
        ];
    }
}

