<?php

namespace App\Services;

use App\Repositories\PaymentNetworkRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentNetworkService
{
    protected PaymentNetworkRepository $paymentNetworkRepository;

    public function __construct(PaymentNetworkRepository $paymentNetworkRepository)
    {
        $this->paymentNetworkRepository = $paymentNetworkRepository;
    }

    public function paginate($perPage = 10, array $filters = []): Collection|LengthAwarePaginator
    {
        return $this->paymentNetworkRepository->paginate($perPage, $filters);
    }

    public function find($id): ?Model
    {
        return $this->paymentNetworkRepository->findById($id);
    }

    /**
     * @throws Exception
     */
    public function create(array $data): Model
    {
        // Ensure tags is properly formatted as array
        if (isset($data['tags']) && is_string($data['tags'])) {
            $data['tags'] = json_decode($data['tags'], true) ?? [];
        }
        if (isset($data['tags']) && !is_array($data['tags'])) {
            $data['tags'] = [];
        }

        return $this->paymentNetworkRepository->create($data);
    }

    /**
     * @throws Exception
     */
    public function update($id, array $data): ?Model
    {
        $paymentNetwork = $this->paymentNetworkRepository->findById($id);

        if (!$paymentNetwork) {
            throw new Exception('Payment network not found');
        }

        // Ensure tags is properly formatted as array
        if (isset($data['tags']) && is_string($data['tags'])) {
            $data['tags'] = json_decode($data['tags'], true) ?? [];
        }
        if (isset($data['tags']) && !is_array($data['tags'])) {
            $data['tags'] = [];
        }

        return $this->paymentNetworkRepository->update($data, $id);
    }

    public function delete($id, $force = false): bool
    {
        return $this->paymentNetworkRepository->delete($id, $force);
    }
}