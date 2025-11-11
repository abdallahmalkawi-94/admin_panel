<?php

namespace App\Http\Requests;

use App\Http\Constants\MerchantConstants;
use App\Models\Merchant;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMerchantRequest extends FormRequest
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
        $merchant = $this->route('merchant');
        $payoutModels = array_keys(MerchantConstants::getPayoutModels());
        $orderTypes = array_keys(MerchantConstants::getOrderTypes());

        return [
            // Merchant basic info
            'en_name' => ['sometimes', 'required', 'string', 'max:255'],
            'ar_name' => ['sometimes', 'required', 'string', 'max:255'],
            'commercial_registry_name' => ['nullable', 'string', 'max:255'],
            'product_id' => ['sometimes', 'required', 'integer', 'exists:products,id'],
            'referral_id' => ['sometimes', 'integer', Rule::unique('merchants')->where(function ($query) {
                return $query->where('product_id', request('product_id'));
            })->ignore($merchant->getAttribute('id'))],
            'parent_merchant_id' => ['nullable', 'integer', 'exists:merchants,id'],
            'status_id' => ['sometimes', 'required', 'integer', 'exists:merchant_statuses,id'],
            'is_live' => ['boolean'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,svg', 'max:2048'],
            'attachment' => ['nullable', 'file', 'mimes:zip,rar', 'max:10240'],

            // Merchant settings
            'settings' => ['required', 'array'],
            'settings.payout_model' => ['sometimes', 'required', 'integer', Rule::in($payoutModels)],
            'settings.bank_id' => ['nullable', 'integer', 'exists:banks,id'],
            'settings.iban' => ['nullable', 'string', 'max:255'],
            'settings.bank_account_no' => ['nullable', 'string', 'max:255'],
            'settings.supported_order_type' => ['sometimes', 'required', 'integer', Rule::in($orderTypes)],
            'settings.has_custom_urls' => ['boolean'],
            'settings.urls_settings' => ['nullable', 'array'],
            'settings.urls_settings.callback_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.webhook_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.invoice_inquiry_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.invoice_creation_url' => ['nullable', 'url', 'max:255'],
            'settings.urls_settings.token_key' => ['nullable', 'string', 'max:255'],
            'settings.terms_and_condition_id' => ['sometimes', 'required', 'integer', 'exists:terms_and_conditions,id'],
            'settings.is_enable_sms_notification' => ['boolean'],
            'settings.monthly_sms' => ['integer', 'min:0'],
            'settings.daily_sms' => ['integer', 'min:0'],
            'settings.monthly_sms_counter' => ['integer', 'min:0'],
            'settings.daily_sms_counter' => ['integer', 'min:0'],
            'settings.is_enable_email_notification' => ['boolean'],
            'settings.is_enable_auto_redirect' => ['boolean'],
            'settings.country_code' => ['required', 'string', 'max:2', 'exists:countries,iso2'],
            'settings.currency_code' => ['required', 'string', 'max:3', 'exists:currencies,code'],

            // Invoice types
            'invoice_type_ids' => ['required', 'array', 'min:1'],
            'invoice_type_ids.*' => ['integer', 'exists:invoice_types,id'],
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
            'payout_model' => 'payout model',
            'bank_id' => 'bank',
            'iban' => 'IBAN',
            'bank_account_no' => 'bank account number',
            'supported_order_type' => 'supported order type',
            'terms_and_condition_id' => 'terms and conditions',
            'invoice_type_ids' => 'invoice types',
        ];
    }
}

