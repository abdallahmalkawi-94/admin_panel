<?php

namespace App\Http\Resources;

use App\Constants\fees_type;
use App\Constants\payout_models;
use App\Constants\refund_option;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PspPaymentMethodResource extends JsonResource
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
            'psp_id' => $this->psp_id,
            'psp' => $this->whenLoaded('psp', function () {
                return [
                    'id' => $this->psp->id,
                    'name' => $this->psp->name,
                    'code' => $this->psp->code,
                ];
            }),
            'payment_method_id' => $this->payment_method_id,
            'payment_method' => $this->whenLoaded('paymentMethod', function () {
                return [
                    'id' => $this->paymentMethod->id,
                    'description' => $this->paymentMethod->description,
                    'code' => $this->paymentMethod->code,
                ];
            }),
            'merchant_id' => $this->merchant_id,
            'merchant' => $this->whenLoaded('merchant', function () {
                return [
                    'id' => $this->merchant->id,
                    'en_name' => $this->merchant->en_name,
                    'ar_name' => $this->merchant->ar_name,
                ];
            }),
            'invoice_type_id' => $this->invoice_type_id,
            'invoice_type' => $this->whenLoaded('invoiceType', function () {
                return [
                    'id' => $this->invoiceType->id,
                    'code' => $this->invoiceType->code,
                    'description' => $this->invoiceType->description,
                ];
            }),
            'refund_option_id' => $this->refund_option_id,
            'refund_option' => [
                'id' => $this->refund_option_id,
                'description' => refund_option::REFUND_OPTIONS[$this->refund_option_id]
            ],
            'payout_model_id' => $this->payout_model_id,
            'payout_model' => [
                'id' => $this->payout_model_id,
                'description' => payout_models::PAYOUT_MODEL[$this->payout_model_id]
            ],
            'support_tokenization' => $this->support_tokenization,
            'subscription_model' => $this->subscription_model,
            'is_active' => $this->is_active,
            'shown_in_checkout' => $this->shown_in_checkout,
            'support_international_payment' => $this->support_international_payment,
            'post_fees_to_psp' => $this->post_fees_to_psp,
            'fees_type' => $this->fees_type,
            'fees_type_description' => fees_type::FEES_TYPE[$this->fees_type],
            'priority' => $this->priority,
            'max_allowed_amount' => $this->max_allowed_amount,
            'min_allowed_amount' => $this->min_allowed_amount,
            'config' => $this->config,
            'test_config' => $this->test_config,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
