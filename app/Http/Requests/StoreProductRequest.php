<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
        return [
            "en_name"               => ["required", "string", "max:100"],
            "ar_name"               => ["required", "string", "max:100"],
            "signing_active"        => ["required", "boolean:strict", "max:100"],
            "callback_url"          => ["nullable", "url:http,https"],
            "webhook_url"           => ["nullable", "url:http,https"],
            "invoice_inquiry_api"   => ["nullable", "url:http,https"],
            "invoice_creation_api"  => ["nullable", "url:http,https"],
//            "integration_type"      => ["required", "string"],
            "hmac_key"              => ["nullable", "string", "max:64"],
            "token_key"             => ["nullable", "required_with:webhook_url", "string"],
            "secret_key"            => ["required", "string", "max:20"],
        ];
    }
}
