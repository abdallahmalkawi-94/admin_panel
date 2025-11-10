<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'en_name' => $this->en_name,
            'ar_name' => $this->ar_name,
            'commercial_registry_name' => $this->commercial_registry_name,
            'product_id' => $this->product_id,
            'product' => [
                'id' => $this->product?->id,
                'en_name' => $this->product?->en_name,
                'ar_name' => $this->product?->ar_name,
            ],
            'referral_id' => $this->referral_id,
            'parent_merchant_id' => $this->parent_merchant_id,
            'parent_merchant' => [
                'id' => $this->parentMerchant?->id,
                'en_name' => $this->parentMerchant?->en_name,
                'ar_name' => $this->parentMerchant?->ar_name,
            ],
            'status_id' => $this->status_id,
            'status' => [
                'id' => $this->status?->id,
                'description' => $this->status?->description,
            ],
            'is_live' => $this->is_live,
            'logo_url' => $this->logo_url ? asset('storage/' . $this->logo_url) : null,
            'settings' => $this->when($this->relationLoaded('settings'), function () {
                return [
                    'id' => $this->settings?->id,
                    'payout_model' => $this->settings?->payout_model,
                    'bank_id' => $this->settings?->bank_id,
                    'bank' => [
                        'id' => $this->settings?->bank?->id,
                        'en_name' => $this->settings?->bank?->en_name,
                        'ar_name' => $this->settings?->bank?->ar_name,
                    ],
                    'iban' => $this->settings?->iban,
                    'bank_account_no' => $this->settings?->bank_account_no,
                    'supported_order_type' => $this->settings?->supported_order_type,
                    'has_custom_urls' => $this->settings?->has_custom_urls,
                    'urls_settings' => $this->settings?->urls_settings,
                    'attachment' => $this->settings?->attachment,
                    'terms_and_condition_id' => $this->settings?->terms_and_condition_id,
                    'terms_and_condition' => [
                        'id' => $this->settings?->termsAndCondition?->id,
                        'version' => $this->settings?->termsAndCondition?->version,
                    ],
                    'is_enable_sms_notification' => $this->settings?->is_enable_sms_notification,
                    'monthly_sms' => $this->settings?->monthly_sms,
                    'monthly_sms_counter' => $this->settings?->monthly_sms_counter,
                    'daily_sms' => $this->settings?->daily_sms,
                    'daily_sms_counter' => $this->settings?->daily_sms_counter,
                    'is_enable_email_notification' => $this->settings?->is_enable_email_notification,
                    'is_enable_auto_redirect' => $this->settings?->is_enable_auto_redirect,
                    'country_code' => $this->settings?->country_code,
                    'country' => [
                        'name' => $this->settings->country?->name,
                        'code' => $this->settings->country?->iso2
                    ],
                    'currency_code' => $this->settings?->currency_code,
                    'currency' => [
                        'name' => $this->settings->currency?->name,
                        'code' => $this->settings->currency?->code,
                        'symbol' => $this->settings->currency?->symbol
                    ]
                ];
            }),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}

