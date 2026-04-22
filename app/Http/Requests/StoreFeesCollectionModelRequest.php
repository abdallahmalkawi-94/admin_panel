<?php

namespace App\Http\Requests;

use App\Models\FeesCollectionModel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreFeesCollectionModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $decimalFields = [
            'from',
            'to',
            'foc_fixed',
            'fom_fixed',
            'foc_percentage',
            'fom_percentage',
            'foc_psp_cost_fixed',
            'fom_psp_cost_fixed',
            'fom_psp_cost_percentage',
            'foc_psp_cost_percentage',
            'installment_fom_fixed',
            'installment_fom_percentage',
            'installment_foc_fixed',
            'installment_foc_percentage',
        ];

        $slices = collect(is_array($this->input('slices')) ? $this->input('slices') : [])
            ->map(function ($slice) use ($decimalFields) {
                if (! is_array($slice)) {
                    return $slice;
                }

                $normalizedSlice = $slice;

                if (array_key_exists('id', $normalizedSlice) && $normalizedSlice['id'] !== null && $normalizedSlice['id'] !== '') {
                    $normalizedSlice['id'] = (int) $normalizedSlice['id'];
                } else {
                    $normalizedSlice['id'] = null;
                }

                foreach ($decimalFields as $field) {
                    if (! array_key_exists($field, $normalizedSlice)) {
                        continue;
                    }

                    $value = $normalizedSlice[$field];

                    if ($value === '' || $value === null) {
                        $normalizedSlice[$field] = $field === 'to' ? null : 0;

                        continue;
                    }

                    $normalizedSlice[$field] = is_string($value) ? trim($value) : $value;
                }

                $normalizedSlice['is_default'] = filter_var(
                    $normalizedSlice['is_default'] ?? false,
                    FILTER_VALIDATE_BOOLEAN,
                    FILTER_NULL_ON_FAILURE
                ) ?? false;

                return $normalizedSlice;
            })
            ->values()
            ->all();

        $this->merge([
            'slices' => $slices,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'slices' => ['required', 'array', 'min:1'],
            'slices.*' => ['required', 'array'],
            'slices.*.id' => ['nullable', 'integer', 'distinct'],
            'slices.*.from' => ['required', 'numeric', 'min:0'],
            'slices.*.to' => ['nullable', 'numeric'],
            'slices.*.foc_fixed' => ['required', 'numeric', 'min:0'],
            'slices.*.fom_fixed' => ['required', 'numeric', 'min:0'],
            'slices.*.foc_percentage' => ['required', 'numeric', 'min:0'],
            'slices.*.fom_percentage' => ['required', 'numeric', 'min:0'],
            'slices.*.foc_psp_cost_fixed' => ['required', 'numeric', 'min:0'],
            'slices.*.fom_psp_cost_fixed' => ['required', 'numeric', 'min:0'],
            'slices.*.fom_psp_cost_percentage' => ['required', 'numeric', 'min:0'],
            'slices.*.foc_psp_cost_percentage' => ['required', 'numeric', 'min:0'],
            'slices.*.installment_fom_fixed' => ['required', 'numeric', 'min:0'],
            'slices.*.installment_fom_percentage' => ['required', 'numeric', 'min:0'],
            'slices.*.installment_foc_fixed' => ['required', 'numeric', 'min:0'],
            'slices.*.installment_foc_percentage' => ['required', 'numeric', 'min:0'],
            'slices.*.is_default' => ['required', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $slices = collect(is_array($this->input('slices')) ? $this->input('slices') : [])
                ->map(function ($slice, int $index) {
                    if (! is_array($slice)) {
                        return ['_index' => $index];
                    }

                    return [...$slice, '_index' => $index];
                })
                ->values();

            if ($slices->isEmpty()) {
                return;
            }

            $defaultCount = $slices->where('is_default', true)->count();

            if ($defaultCount !== 1) {
                $validator->errors()->add('slices', 'Exactly one default slice is required.');
            }

            $maxRowsCount = $slices->whereNull('to')->count();

            if ($maxRowsCount > 1) {
                $validator->errors()->add('slices', 'Only one range can use Max as the upper bound.');
            }

            $pspPaymentMethod = $this->route('pspPaymentMethod');
            $sliceIds = $slices->pluck('id')->filter()->map(fn ($id) => (int) $id)->values();

            if ($sliceIds->isNotEmpty()) {
                $ownedIds = FeesCollectionModel::query()
                    ->where('psp_payment_method_id', $pspPaymentMethod?->id)
                    ->whereIn('id', $sliceIds)
                    ->pluck('id')
                    ->map(fn ($id) => (int) $id)
                    ->all();

                foreach ($sliceIds as $sliceId) {
                    if (! in_array($sliceId, $ownedIds, true)) {
                        $invalidSlice = $slices->first(
                            fn (array $slice) => (int) ($slice['id'] ?? 0) === $sliceId
                        );

                        if (is_array($invalidSlice)) {
                            $validator->errors()->add(
                                "slices.{$invalidSlice['_index']}.id",
                                'The selected fee slice does not belong to this PSP payment method.',
                            );
                        }
                    }
                }
            }

            $sortedSlices = $slices
                ->sortBy([
                    fn (array $slice) => (float) $slice['from'],
                    fn (array $slice) => $slice['to'] === null ? INF : (float) $slice['to'],
                ])
                ->values();

            foreach ($sortedSlices as $position => $slice) {
                if (! is_numeric($slice['from']) || ($slice['to'] !== null && ! is_numeric($slice['to']))) {
                    continue;
                }

                if ($slice['to'] !== null && (float) $slice['to'] < (float) $slice['from']) {
                    $validator->errors()->add(
                        "slices.{$slice['_index']}.to",
                        'The upper bound must be greater than or equal to the lower bound.',
                    );
                }

                if ($position === 0) {
                    continue;
                }

                $previousSlice = $sortedSlices[$position - 1];

                if (! is_numeric($previousSlice['from']) || ($previousSlice['to'] !== null && ! is_numeric($previousSlice['to']))) {
                    continue;
                }

                if ($previousSlice['to'] === null || (float) $slice['from'] <= (float) $previousSlice['to']) {
                    $validator->errors()->add(
                        "slices.{$slice['_index']}.from",
                        'This range overlaps with another fee slice.',
                    );
                }
            }
        });
    }
}
