<?php

namespace App\Http\Requests;

use App\Constants\subscription_model;
use App\Models\Merchant;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreMerchantPaymentMethodsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invoice_type_ids' => ['required', 'array', 'min:1'],
            'invoice_type_ids.*' => ['required', 'integer', 'exists:invoice_types,id'],
            'child_merchant_ids' => ['nullable', 'array'],
            'child_merchant_ids.*' => ['required', 'integer', 'exists:merchants,id'],
            'psp_payment_method_ids' => ['required', 'array', 'min:1'],
            'psp_payment_method_ids.*' => ['required', 'integer', 'exists:psp_payment_methods,id'],
            'payment_methods' => ['required', 'array', 'min:1'],
            'payment_methods.*.source_psp_payment_method_id' => ['required', 'integer', 'exists:psp_payment_methods,id', 'distinct'],

            'payment_methods.*.original' => ['required', 'array'],
            'payment_methods.*.original.id' => ['required', 'integer'],
            'payment_methods.*.original.psp_id' => ['required', 'integer', 'exists:psps,id'],
            'payment_methods.*.original.payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'payment_methods.*.original.support_tokenization' => ['nullable', 'boolean:strict'],
            'payment_methods.*.original.payout_model_id' => ['required', 'integer', 'exists:payout_models,id'],
            'payment_methods.*.original.shown_in_checkout' => ['nullable', 'boolean:strict'],
            'payment_methods.*.original.support_international_payment' => ['nullable', 'boolean:strict'],
            'payment_methods.*.original.fees_type' => ['required', 'integer'],
            'payment_methods.*.original.priority' => ['required', 'integer', 'min:0'],
            'payment_methods.*.original.refund_option_id' => ['required', 'integer', 'exists:refund_options,id'],

            'payment_methods.*.edited' => ['required', 'array'],
            'payment_methods.*.edited.subscription_model' => ['required', 'integer', 'in:' . implode(',', [subscription_model::REVENUE_SHARING, subscription_model::LICENCE])],
            'payment_methods.*.edited.min_allowed_amount' => ['required', 'integer', 'min:0'],
            'payment_methods.*.edited.max_allowed_amount' => ['required', 'integer', 'min:0'],
            'payment_methods.*.edited.is_active' => ['required', 'boolean:strict'],
            'payment_methods.*.edited.post_fees_to_psp' => ['required', 'boolean:strict'],
            'payment_methods.*.edited.config' => ['required', 'array'],
            'payment_methods.*.edited.test_config' => ['required', 'array'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $selectedPaymentMethodIds = collect($this->input('psp_payment_method_ids', []))
                ->map(static fn($id) => (int)$id)
                ->sort()
                ->values()
                ->all();

            $payloadPaymentMethodIds = collect($this->input('payment_methods', []))
                ->pluck('source_psp_payment_method_id')
                ->map(static fn($id) => (int)$id)
                ->sort()
                ->values()
                ->all();

            if ($selectedPaymentMethodIds !== $payloadPaymentMethodIds) {
                $validator->errors()->add(
                    'payment_methods',
                    'The payment methods payload must exactly match the selected payment methods.',
                );
            }

            foreach ($this->input('payment_methods', []) as $index => $paymentMethod) {
                $sourceId = (int)data_get($paymentMethod, 'source_psp_payment_method_id');
                $originalId = data_get($paymentMethod, 'original.id');

                if ($originalId !== null && (int)$originalId !== $sourceId) {
                    $validator->errors()->add(
                        "payment_methods.$index.original.id",
                        'The original payment method snapshot must match the source payment method.',
                    );
                }
            }

            $merchant = $this->route('merchant');

            if (!$merchant instanceof Merchant) {
                return;
            }

            $invoiceTypeIds = $this->input('invoice_type_ids', []);
            $validInvoiceTypeIds = $merchant->invoiceTypes()
                ->whereIn('invoice_types.id', $invoiceTypeIds)
                ->pluck('invoice_types.id')
                ->map(static fn($id) => (int)$id)
                ->all();

            if (array_diff($invoiceTypeIds, $validInvoiceTypeIds) !== []) {
                $validator->errors()->add(
                    'invoice_type_ids',
                    'The selected invoice types must belong to the merchant.',
                );
            }

            $childMerchantIds = $this->input('child_merchant_ids', []);
            $validChildMerchantIds = $merchant->childMerchants()
                ->whereIn('id', $childMerchantIds)
                ->pluck('id')
                ->map(static fn($id) => (int)$id)
                ->all();

            if (array_diff($childMerchantIds, $validChildMerchantIds) !== []) {
                $validator->errors()->add(
                    'child_merchant_ids',
                    'The selected child merchants must belong to the merchant.',
                );
            }
        });
    }

    protected function prepareForValidation(): void
    {
        $normalizeIds = static fn($values): array => collect(
            is_array($values) ? $values : []
        )
            ->filter(static fn($value) => $value !== null && $value !== '')
            ->map(static fn($value) => (int)$value)
            ->unique()
            ->values()
            ->all();

        $normalizeBoolean = static function (array $payload, string $key): mixed {
            if (!array_key_exists($key, $payload)) {
                return null;
            }

            $value = $payload[$key];
            $normalizedValue = filter_var(
                $value,
                FILTER_VALIDATE_BOOLEAN,
                FILTER_NULL_ON_FAILURE
            );

            return $normalizedValue ?? $value;
        };

        $paymentMethods = collect(is_array($this->payment_methods) ? $this->payment_methods : [])
            ->map(function ($paymentMethod) use ($normalizeBoolean) {
                if (!is_array($paymentMethod)) {
                    return $paymentMethod;
                }

                $edited = is_array($paymentMethod['edited'] ?? null)
                    ? $paymentMethod['edited']
                    : [];
                $original = is_array($paymentMethod['original'] ?? null)
                    ? $paymentMethod['original']
                    : [];

                if (array_key_exists('id', $original) && $original['id'] !== null && $original['id'] !== '') {
                    $original['id'] = (int)$original['id'];
                }

                return [
                    ...$paymentMethod,
                    'source_psp_payment_method_id' => isset($paymentMethod['source_psp_payment_method_id'])
                        ? (int)$paymentMethod['source_psp_payment_method_id']
                        : null,
                    'original' => $original,
                    'edited' => [
                        'subscription_model' => isset($edited['subscription_model'])
                            ? (int)$edited['subscription_model']
                            : null,
                        'min_allowed_amount' => isset($edited['min_allowed_amount'])
                            ? (int)$edited['min_allowed_amount']
                            : null,
                        'max_allowed_amount' => isset($edited['max_allowed_amount'])
                            ? (int)$edited['max_allowed_amount']
                            : null,
                        'is_active' => $normalizeBoolean($edited, 'is_active'),
                        'post_fees_to_psp' => $normalizeBoolean($edited, 'post_fees_to_psp'),
                        'config' => is_array($edited['config'] ?? null)
                            ? $edited['config']
                            : [],
                        'test_config' => is_array($edited['test_config'] ?? null)
                            ? $edited['test_config']
                            : [],
                    ],
                ];
            })
            ->values()
            ->all();

        $this->merge([
            'invoice_type_ids' => $normalizeIds($this->invoice_type_ids),
            'child_merchant_ids' => $normalizeIds($this->child_merchant_ids),
            'psp_payment_method_ids' => $normalizeIds($this->psp_payment_method_ids),
            'payment_methods' => $paymentMethods,
        ]);
    }
}
