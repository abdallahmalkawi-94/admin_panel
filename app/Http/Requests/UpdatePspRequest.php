<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePspRequest extends FormRequest
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'country_code' => ['required', 'string', 'max:2', 'exists:countries,iso2'],
            'settlement_currency_code' => ['required', 'string', 'max:3', 'exists:currencies,code'],
            'monthly_fees' => ['nullable', 'numeric', 'min:0'],
            'psp_status_id' => ['required', 'integer', 'exists:psp_statuses,id'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'base_url' => ['nullable', 'string', 'max:255'],
            'sdk_version' => ['nullable', 'string', 'max:255'],
            'dashboard_url' => ['nullable', 'string', 'max:255'],
            'support_money_splitting' => ['boolean'],
            'notes' => ['nullable', 'string'],
            'attachment' => ['nullable', 'file', 'mimes:zip,rar', 'max:10240'], // 10MB max
            'password' => ['nullable', 'string', 'max:255'],
            'bank_id' => ['nullable', 'integer', 'exists:banks,id'],
            'bank_account_number' => ['nullable', 'string', 'max:255'],
            'iban' => ['nullable', 'string', 'max:255'],
            'enable_auto_transfer' => ['boolean'],
        ];
    }
}
