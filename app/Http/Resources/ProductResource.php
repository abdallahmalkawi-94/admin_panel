<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'signing_active' => (bool) $this->signing_active,
            'callback_url' => $this->callback_url,
            'webhook_url' => $this->webhook_url,
            'invoice_inquiry_api' => $this->invoice_inquiry_api,
            'invoice_creation_api' => $this->invoice_creation_api,
            'hmac_key' => $this->hmac_key,
            'token_key' => $this->token_key,
            'secret_key' => $this->secret_key,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
