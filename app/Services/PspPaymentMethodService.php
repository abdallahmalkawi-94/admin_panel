<?php

namespace App\Services;

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
        return $this->pspPaymentMethodRepository->paginate($perPage, $filters);
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
        return $this->pspPaymentMethodRepository->create($data);
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