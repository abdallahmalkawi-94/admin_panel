<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'country_code' => $this->country_code,
            'country_name' => $this->country?->name,
            'mobile_number' => $this->mobile_number,
            'status_id' => $this->status_id,
            'status' => [
                'id' => $this->status?->id,
                'description' => $this->status?->description,
            ],
            'product_id' => $this->product_id,
            'product' => $this->whenLoaded('product', function () {
                return [
                    'id' => $this->product->id,
                    'en_name' => $this->product->en_name,
                    'ar_name' => $this->product->ar_name,
                ];
            }),
            'role' => $this->getRoleNames()->first(),
            'user_merchants' => $this->whenLoaded('userMerchants', function () {
                return $this->userMerchants->map(function ($userMerchant) {
                    return [
                        'id' => $userMerchant->id,
                        'user_id' => $userMerchant->user_id,
                        'merchant_id' => $userMerchant->merchant_id,
                    ];
                });
            }),
            'merchants' => $this->whenLoaded('userMerchants', function () {
                return $this->userMerchants->map(function ($userMerchant) {
                    return [
                        'id' => $userMerchant->merchant->id,
                        'en_name' => $userMerchant->merchant->en_name,
                        'ar_name' => $userMerchant->merchant->ar_name,
                    ];
                });
            }),
            'avatar' => $this->avatar ? asset('storage/' . $this->avatar) : null,
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
