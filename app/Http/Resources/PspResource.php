<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PspResource extends JsonResource
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
            'code' => $this->code,
            'country_code' => $this->country_code,
            'country' => $this->whenLoaded('country', function () {
                return [
                    'id' => $this->country->id,
                    'name' => $this->country->name,
                    'iso2' => $this->country->iso2,
                ];
            }),
            'settlement_currency_code' => $this->settlement_currency_code,
            'settlement_currency' => $this->whenLoaded('settlementCurrency', function () {
                return [
                    'id' => $this->settlementCurrency->id,
                    'name' => $this->settlementCurrency->name,
                    'code' => $this->settlementCurrency->code,
                    'symbol' => $this->settlementCurrency->symbol,
                ];
            }),
            'monthly_fees' => $this->monthly_fees,
            'psp_status_id' => $this->psp_status_id,
            'status' => $this->whenLoaded('status', function () {
                return [
                    'id' => $this->status->id,
                    'code' => $this->status->code,
                    'description' => $this->status->description,
                ];
            }),
            'contact_person' => $this->contact_person,
            'contact_email' => $this->contact_email,
            'base_url' => $this->base_url,
            'sdk_version' => $this->sdk_version,
            'dashboard_url' => $this->dashboard_url,
            'support_money_splitting' => $this->support_money_splitting,
            'notes' => $this->notes,
            'attachment' => $this->attachment,
            'password' => $this->password,
            'bank_id' => $this->bank_id,
            'bank' => $this->whenLoaded('bank', function () {
                return [
                    'id' => $this->bank->id,
                    'en_name' => $this->bank->en_name,
                    'ar_name' => $this->bank->ar_name,
                    'swift_code' => $this->bank->swift_code,
                ];
            }),
            'bank_account_number' => $this->bank_account_number,
            'iban' => $this->iban,
            'enable_auto_transfer' => $this->enable_auto_transfer,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
