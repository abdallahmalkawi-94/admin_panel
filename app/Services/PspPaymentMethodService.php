<?php

namespace App\Services;

use App\Constants\fees_type;
use App\Models\Merchant;
use App\Models\PspPaymentMethod;
use App\Models\PspStatus;
use App\Repositories\PspPaymentMethodRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PspPaymentMethodService
{
    protected PspPaymentMethodRepository $pspPaymentMethodRepository;

    public function __construct(PspPaymentMethodRepository $pspPaymentMethodRepository)
    {
        $this->pspPaymentMethodRepository = $pspPaymentMethodRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        $result = $this->pspPaymentMethodRepository->paginate($perPage, $filters);

        // Load relationships for paginated results
        if ($result instanceof LengthAwarePaginator) {
            $result->load(['psp', 'paymentMethod', 'merchant', 'invoiceType']);
        }

        return $result;
    }

    public function find($id): ?Model
    {
        return $this->pspPaymentMethodRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        $pspId = $data['psp_id'];
        $paymentMethodsConfig = $data['payment_methods_config'] ?? [];

        if (empty($paymentMethodsConfig)) {
            throw new Exception('At least one payment method configuration is required.');
        }

        // Remove payment_method_id from data as it's an array and we'll create records from payment_methods_config
        unset($data['payment_method_id']);

        $createdRecords = [];

        // Create a record for each payment method configuration
        foreach ($paymentMethodsConfig as $config) {
            $recordData = [
                'psp_id' => $pspId,
                'payment_method_id' => $config['payment_method_id'],
                'refund_option_id' => $config['refund_option_id'] ?? null,
                'payout_model_id' => $config['payout_model_id'] ?? null,
                'support_tokenization' => $config['support_tokenization'] ?? false,
                'subscription_model' => $config['subscription_model'] ?? 1,
                'is_active' => $config['is_active'] ?? true,
                'shown_in_checkout' => $config['shown_in_checkout'] ?? true,
                'support_international_payment' => $config['support_international_payment'] ?? false,
                'post_fees_to_psp' => $config['post_fees_to_psp'] ?? false,
                'fees_type' => fees_type::ON_MERCHANT,
                'priority' => $config['priority'] ?? 0,
                'max_allowed_amount' => $config['max_allowed_amount'] ?? 0,
                'min_allowed_amount' => $config['min_allowed_amount'] ?? 0,
                'config' => $config['config'] ?? null,
                'test_config' => $config['test_config'] ?? null,
            ];

            $createdRecords[] = $this->pspPaymentMethodRepository->create($recordData);
        }

        // Return the last created record
        return end($createdRecords);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        return $this->pspPaymentMethodRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->pspPaymentMethodRepository->delete($id, $force);
    }

    public function where(array $conditions, array $attributes = ['*']): Collection
    {
        return $this->pspPaymentMethodRepository->where($conditions, $attributes);
    }

    public function getSupportedPaymentMethods(Merchant $merchant, array $ids = []): Collection
    {
        $merchantSettings = $merchant->settings()->first(['id', 'merchant_id', 'country_code', 'currency_code']);
        $conditions = [
            "psps.country_code" => $merchantSettings->country_code,
            "psps.settlement_currency_code" => $merchantSettings->currency_code,
            "psps.psp_status_id" => PspStatus::ACTIVE,
        ];

        return $this->pspPaymentMethodRepository->getSupportedPaymentMethods($conditions, $ids);
    }

    /**
     * @throws Exception
     */
    public function storeMerchantPaymentMethods(Merchant $merchant, array $data): int
    {
        $invoiceTypeIds = array_values(array_unique($data['invoice_type_ids'] ?? []));
        $targetMerchantIds = collect([$merchant->id, ...($data['child_merchant_ids'] ?? [])])
            ->map(static fn($merchantId) => (int)$merchantId)
            ->unique()
            ->values()
            ->all();

        $paymentMethodsPayload = collect($data['payment_methods'] ?? [])->keyBy('source_psp_payment_method_id');

//        dd($data, $invoiceTypeIds, $targetMerchantIds, $paymentMethodsPayload);

        $affectedRecords = 0;

        DB::transaction(function () use (
            $invoiceTypeIds,
            $paymentMethodsPayload,
            $targetMerchantIds,
            &$affectedRecords,
        ) {
            $merchantPspPaymentMethods = [];
            foreach ($targetMerchantIds as $targetMerchantId) {
                foreach ($invoiceTypeIds as $invoiceTypeId) {
                    foreach ($paymentMethodsPayload as $sourcePaymentMethodId => $paymentMethodPayload) {
                        $pspPaymentMethod = [
                            "psp_id" => $paymentMethodPayload['original']['psp_id'],
                            "payment_method_id" => $paymentMethodPayload['original']['payment_method_id'],
                            "merchant_id" => $targetMerchantId,
                            "invoice_type_id" => $invoiceTypeId,
                            "support_tokenization" => $paymentMethodPayload['original']['support_tokenization'],
                            "subscription_model" => $paymentMethodPayload['edited']['subscription_model'],
                            "payout_model_id" => $paymentMethodPayload['original']['payout_model_id'],
                            "is_active" => $paymentMethodPayload['edited']['is_active'],
                            "shown_in_checkout" => $paymentMethodPayload['original']['shown_in_checkout'],
                            "support_international_payment" => $paymentMethodPayload['original']['support_international_payment'],
                            "post_fees_to_psp" => $paymentMethodPayload['edited']['post_fees_to_psp'],
                            "fees_type" => $paymentMethodPayload['original']['fees_type'],
                            "priority" => $paymentMethodPayload['original']['priority'],
                            "refund_option_id" => $paymentMethodPayload['original']['refund_option_id'],
                            "max_allowed_amount" => $paymentMethodPayload['edited']['max_allowed_amount'],
                            "min_allowed_amount" => $paymentMethodPayload['edited']['min_allowed_amount'],
                            "config" => json_encode($paymentMethodPayload['edited']['config']),
                            "test_config" => json_encode($paymentMethodPayload['edited']['test_config']),
                        ];

                        $merchantPspPaymentMethods[] = $pspPaymentMethod;
                        $affectedRecords++;
                    }
                }
            }

            PspPaymentMethod::query()->upsert($merchantPspPaymentMethods, ['psp_id', 'payment_method_id', 'merchant_id', 'invoice_type_id']);
        });

        return $affectedRecords;
    }
}
