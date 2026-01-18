<?php

namespace App\Services;

use App\Constants\fees_type;
use App\Repositories\PspPaymentMethodRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

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
            $result->load(['psp', 'paymentMethod', 'merchant']);
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

            // TODO Should be handle create or update
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
}
