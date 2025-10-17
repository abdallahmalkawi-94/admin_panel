<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurrencyResource extends JsonResource
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
            'country_id' => $this->country_id,
            'country_name' => $this->country?->name,
            'name' => $this->name,
            'code' => $this->code,
            'precision' => $this->precision,
            'symbol' => $this->symbol,
            'symbol_native' => $this->symbol_native,
            'symbol_first' => (bool) $this->symbol_first,
            'decimal_mark' => $this->decimal_mark,
            'thousands_separator' => $this->thousands_separator,
        ];
    }
}

