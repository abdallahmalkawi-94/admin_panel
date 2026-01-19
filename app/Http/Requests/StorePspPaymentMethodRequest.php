<?php

namespace App\Http\Requests;

use App\Constants\payout_models;
use App\Constants\refund_option;
use App\Constants\subscription_model;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePspPaymentMethodRequest extends FormRequest
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
        // Check if payment_methods_config is present and not empty
        $hasPaymentMethodsConfig = $this->has('payment_methods_config') 
            && is_array($this->payment_methods_config) 
            && count($this->payment_methods_config) > 0;

        $dataToMerge = [];

        // Only include top-level config fields if payment_methods_config is not present
        if (!$hasPaymentMethodsConfig) {
            $dataToMerge = array_merge($dataToMerge, [
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
        } else {
            // Remove top-level config fields when payment_methods_config is present
            $this->request->remove('support_tokenization');
            $this->request->remove('subscription_model');
            $this->request->remove('is_active');
            $this->request->remove('shown_in_checkout');
            $this->request->remove('support_international_payment');
            $this->request->remove('post_fees_to_psp');
            $this->request->remove('fees_type');
            $this->request->remove('priority');
            $this->request->remove('max_allowed_amount');
            $this->request->remove('min_allowed_amount');
            $this->request->remove('config');
            $this->request->remove('test_config');
            $this->request->remove('refund_option_id');
            $this->request->remove('payout_model_id');
        }

        $this->merge($dataToMerge);

        // Also handle payment_methods_config nested fields
        if ($hasPaymentMethodsConfig) {
            $paymentMethodsConfig = [];
            foreach ($this->payment_methods_config as $index => $config) {
                $paymentMethodsConfig[$index] = $config;
                // Convert empty strings to null for nullable fields in nested config
                if (isset($config['refund_option_id']) && ($config['refund_option_id'] === '' || $config['refund_option_id'] === 'null')) {
                    $paymentMethodsConfig[$index]['refund_option_id'] = null;
                }
                if (isset($config['payout_model_id']) && ($config['payout_model_id'] === '' || $config['payout_model_id'] === 'null')) {
                    $paymentMethodsConfig[$index]['payout_model_id'] = null;
                }
            }
            $this->merge(['payment_methods_config' => $paymentMethodsConfig]);
        }
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
            'payment_method_id' => ['required', 'array', 'min:1'],
            'payment_method_id.*' => ['required', 'integer', 'exists:payment_methods,id'],
            // These are only required if payment_methods_config is not provided
            // They are removed in prepareForValidation when payment_methods_config is present
            'refund_option_id' => ['required_without:payment_methods_config', 'integer', 'exists:refund_options,id'],
            'payout_model_id' => ['required_without:payment_methods_config', 'integer', 'exists:payout_models,id'],
            'support_tokenization' => ['required_without:payment_methods_config', 'boolean:strict'],
            'subscription_model' => ['required_without:payment_methods_config', 'integer', 'in:' . implode(',', [subscription_model::REVENUE_SHARING, subscription_model::LICENCE])],
            'is_active' => ['required_without:payment_methods_config', 'boolean:strict'],
            'shown_in_checkout' => ['required_without:payment_methods_config', 'boolean:strict'],
            'support_international_payment' => ['required_without:payment_methods_config', 'boolean:strict'],
            'post_fees_to_psp' => ['required_without:payment_methods_config', 'boolean:strict'],
            'fees_type' => ['required_without:payment_methods_config', 'integer', 'min:0'],
            'priority' => ['required_without:payment_methods_config', 'integer', 'min:0'],
            'max_allowed_amount' => ['required_without:payment_methods_config', 'integer', 'min:0'],
            'min_allowed_amount' => ['required_without:payment_methods_config', 'integer', 'min:0'],
            'config' => ['nullable', 'array'],
            'test_config' => ['nullable', 'array'],
            // Allow per-payment-method configurations
            'payment_methods_config' => ['nullable', 'array'],
            'payment_methods_config.*.payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'payment_methods_config.*.refund_option_id' => ['required', 'integer', 'exists:refund_options,id'],
            'payment_methods_config.*.payout_model_id' => ['required', 'integer', 'exists:payout_models,id'],
            'payment_methods_config.*.support_tokenization' => ['nullable', 'boolean:strict'],
            'payment_methods_config.*.subscription_model' => ['nullable', 'integer', 'in:' . implode(',', [subscription_model::REVENUE_SHARING, subscription_model::LICENCE])],
            'payment_methods_config.*.is_active' => ['nullable', 'boolean:strict'],
            'payment_methods_config.*.shown_in_checkout' => ['nullable', 'boolean:strict'],
            'payment_methods_config.*.support_international_payment' => ['nullable', 'boolean:strict'],
            'payment_methods_config.*.post_fees_to_psp' => ['nullable', 'boolean:strict'],
            'payment_methods_config.*.fees_type' => ['nullable', 'integer', 'min:0'],
            'payment_methods_config.*.priority' => ['nullable', 'integer', 'min:0'],
            'payment_methods_config.*.max_allowed_amount' => ['nullable', 'integer', 'min:0'],
            'payment_methods_config.*.min_allowed_amount' => ['nullable', 'integer', 'min:0'],
            'payment_methods_config.*.config' => ['nullable', 'array'],
            'payment_methods_config.*.test_config' => ['nullable', 'array'],
        ];
    }
}
