<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayerProfileResource extends JsonResource
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
            'full_name' => $this->full_name,
            'username' => $this->username,
            'referral_id' => $this->referral_id,
            'email' => $this->email,
            'mobile_number' => $this->mobile_number,
            'product_id' => $this->product_id,
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product?->id,
                    'en_name' => $this->product?->en_name,
                    'ar_name' => $this->product?->ar_name,
                ];
            }),
            'merchant_id' => $this->merchant_id,
            'merchant' => $this->whenLoaded('merchant', function () {
                return [
                    'id' => $this->merchant?->id,
                    'en_name' => $this->merchant?->en_name,
                    'ar_name' => $this->merchant?->ar_name,
                ];
            }),
            'status' => $this->status,
            'total_points' => $this->total_points,
            'identity_no' => $this->identity_no,
            'identity_type_id' => $this->identity_type_id,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),
        ];
    }
}
