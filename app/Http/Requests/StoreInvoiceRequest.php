<?php

namespace App\Http\Requests;

use App\Http\Constants\MerchantStatusConstants;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInvoiceRequest extends FormRequest
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
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'merchant_id' => [
                'required',
                'integer',
                Rule::exists('merchants', 'id')
                    ->whereNull('deleted_at')
                    ->where('product_id', request()->input('product_id'))
                    ->where('status_id', MerchantStatusConstants::ACTIVE),
            ],
            'invoice_type_id' => [
                'required',
                'integer',
                Rule::exists('merchant_invoices', 'id')
                    ->whereNull('deleted_at')
                    ->where('merchant_id', request()->input('merchant_id'))
            ],
            'invoice_no' => ['required', 'string', 'max:255'],
            'billing_account' => ['required', 'string', 'max:255'],
            'currency_code' => ['required', 'string', 'max:3', 'exists:currencies,code'],
            'due_amount' => ['required', 'numeric', 'min:0'],
            'min_amount' => ['nullable', 'required_if:allow_partial_payment,true', 'numeric', 'min:0'],
            'max_amount' => ['nullable', 'required_if:allow_partial_payment,true', 'numeric', 'min:0'],
            'user_id' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255'],
            'full_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^\+[1-9]\d{1,14}$/'],
            'language_code' => ['required', 'string', 'exists:languages,code'],
            'expiry_date' => ['nullable', Rule::date()->todayOrAfter()],
            'allow_partial_payment' => ['required', 'boolean'],
            'scheduled_payment' => ['required', 'boolean'],
            'billing_frequency' => ['nullable', 'required_if:scheduled_payment,true', Rule::in(['daily', 'weekly', 'monthly', 'annual'])],
            'number_of_repetitions' => ['nullable', 'required_if:scheduled_payment,true', 'integer', 'min:1'],
            'due_date' => [
                'nullable',
                'required_if:scheduled_payment,true',
                Rule::date()->todayOrAfter(),
            ]
        ];
    }
}
