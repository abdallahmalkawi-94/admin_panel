<?php

namespace App\Services;

use App\Repositories\PaymentMethodRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class PaymentMethodService
{
    protected PaymentMethodRepository $paymentMethodRepository;

    public function __construct(PaymentMethodRepository $paymentMethodRepository)
    {
        $this->paymentMethodRepository = $paymentMethodRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->paymentMethodRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->paymentMethodRepository->findById($id);
    }

    /**
     * Generate code from description
     */
    private function generateCode(string $description): string
    {
        $code = preg_replace('/[^A-Za-z0-9\-]/', '', $description);
        return strtolower(str_replace('-', '', $code));
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        // Auto-generate code from description
        if (isset($data['description']) && !isset($data['code'])) {
            $data['code'] = $this->generateCode($data['description']);
        }

        // Handle logo upload if present
        if (isset($data['logo']) && $data['logo']) {
            $data['logo_url'] = $data['logo']->store('payment-methods/logos', 'public');
            unset($data['logo']);
        }

        return $this->paymentMethodRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        $paymentMethod = $this->paymentMethodRepository->findById($id);

        if (!$paymentMethod) {
            throw new Exception('Payment method not found');
        }

        // Auto-generate code from description if description is being updated
        if (isset($data['description']) && !isset($data['code'])) {
            $data['code'] = $this->generateCode($data['description']);
        }

        // Handle logo upload if present
        if (isset($data['logo']) && $data['logo']) {
            // Delete old logo
            if ($paymentMethod->logo_url) {
                Storage::disk('public')->delete($paymentMethod->logo_url);
            }
            $data['logo_url'] = $data['logo']->store('payment-methods/logos', 'public');
            unset($data['logo']);
        }

        return $this->paymentMethodRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->paymentMethodRepository->delete($id, $force);
    }
}
