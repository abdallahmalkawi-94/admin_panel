<?php

namespace App\Http\Requests;

use App\Constants\subscription_model;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePspPaymentMethodRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'support_tokenization' => filter_var(
                $this->support_tokenization ?? false,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
            'is_active' => filter_var(
                $this->is_active ?? true,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ) ?? true,
            'shown_in_checkout' => filter_var(
                $this->shown_in_checkout ?? true,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ) ?? true,
            'support_international_payment' => filter_var(
                $this->support_international_payment ?? false,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
            'post_fees_to_psp' => filter_var(
                $this->post_fees_to_psp ?? false,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            ) ?? false,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'psp_id' => ['required', 'integer', 'exists:psps,id'],
            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'refund_option_id' => ['required', 'integer', 'exists:refund_options,id'],
            'payout_model_id' => ['required', 'integer', 'exists:payout_models,id'],
            'support_tokenization' => ['required', 'boolean:strict'],
            'subscription_model' => ['required', 'integer', 'in:' . implode(',', [subscription_model::REVENUE_SHARING, subscription_model::LICENCE])],
            'is_active' => ['required', 'boolean:strict'],
            'shown_in_checkout' => ['required', 'boolean:strict'],
            'support_international_payment' => ['required', 'boolean:strict'],
            'post_fees_to_psp' => ['required', 'boolean:strict'],
            'fees_type' => ['required', 'integer', 'min:0'],
            'priority' => ['required', 'integer', 'min:0'],
            'max_allowed_amount' => ['required', 'integer', 'min:0'],
            'min_allowed_amount' => ['required', 'integer', 'min:0'],
            'config' => ['nullable', 'array'],
            'test_config' => ['nullable', 'array'],
        ];
    }
}
